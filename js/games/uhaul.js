window.GAMES.uhaul = (function(){
  var raf = null, timer = null;

  function stop(){
    if(raf) cancelAnimationFrame(raf);
    raf = null;
    if(timer) clearInterval(timer);
    timer = null;
  }

  return {
    short: "Road",
    unmount: stop,

    mount: function(root, api){
      stop();

      var W = 460, H = 260, GROUND = 205;
      var DURATION = 60;

      root.appendChild(api.plate(3, "The Drive",
        "Curaçao to Bed Stuy — one truck, borrowed"));

      var s = api.stage();
      root.appendChild(s);

      var hud = api.el("div", "hud");
      var lives = api.el("div", "lives", "❤️❤️❤️");
      var coins = api.el("div", null, "0 coins");
      var clock = api.el("div", null, DURATION + "s");
      hud.appendChild(lives); hud.appendChild(coins); hud.appendChild(clock);
      s.appendChild(hud);

      var wrap = api.el("div", "wrap");
      var cv = document.createElement("canvas");
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = "100%"; cv.style.height = "auto";
      wrap.appendChild(cv);
      s.appendChild(wrap);

      var btn = api.el("button", "jump", "▲  JUMP");
      s.appendChild(btn);

      var ctx = cv.getContext("2d");
      ctx.scale(dpr, dpr);

      /* ---- assets ---- */
      function pic(n){ var i = new Image(); i.src = api.url(n); return i; }
      var truck = pic(A.uhaul);
      var carImgs = A.cars.map(pic);
      var gifts = [pic(A.dauphinois), pic(A.tartar)];
      var coinImg = pic(A.coin);

      /* ---- state ---- */
      var t = 0, left = DURATION, speed = 3.2, dead = false, won = false;
      var life = 3, score = 0, invuln = 0;
      var y = 0, vy = 0, onGround = true;
      var items = [], pops = [], spawnIn = 60, road = 0;

      var TW = 96, TH = 62, CW = 68, CH = 42, GW = 34;

      function jump(){
        if(dead || won) return;
        if(onGround){ vy = -9.6; onGround = false; }
      }

      btn.addEventListener("click", function(e){ e.stopPropagation(); jump(); });
      cv.addEventListener("pointerdown", function(e){ e.preventDefault(); jump(); });
      function key(e){ if(e.code === "Space" || e.code === "ArrowUp"){ e.preventDefault(); jump(); } }
      window.addEventListener("keydown", key);

      timer = setInterval(function(){
        if(dead || won) return;
        left--;
        clock.textContent = left + "s";
        if(left <= 0) win();
      }, 1000);

      function spawn(){
        var gift = Math.random() < 0.45;
        if(gift){
          items.push({ kind:"gift", img: gifts[Math.floor(Math.random()*gifts.length)],
                       x: W + 20, w: GW, h: GW, y: GROUND - GW - (Math.random()<0.3 ? 46 : 4) });
        } else {
          items.push({ kind:"car", img: carImgs[Math.floor(Math.random()*carImgs.length)],
                       x: W + 20, w: CW, h: CH, y: GROUND - CH });
        }
        spawnIn = Math.max(34, 78 - speed * 4) + Math.random() * 40;
      }

      function hit(a, b){
        return a.x < b.x + b.w && a.x + a.w > b.x &&
               a.y < b.y + b.h && a.y + a.h > b.y;
      }

      function loop(){
        raf = requestAnimationFrame(loop);
        t++;

        if(!dead && !won){
          speed = 3.2 + (DURATION - left) * 0.075;

          vy += 0.46; y += vy;
          if(y > 0){ y = 0; vy = 0; onGround = true; }

          if(--spawnIn <= 0) spawn();
          if(invuln > 0) invuln--;

          var truckBox = { x:44, y: GROUND - TH + y, w: TW - 22, h: TH - 8 };

          for(var i = items.length - 1; i >= 0; i--){
            var it = items[i];
            it.x -= speed;
            if(it.x + it.w < -30){ items.splice(i,1); continue; }
            if(hit(truckBox, it)){
              if(it.kind === "gift"){
                score++;
                coins.textContent = score + (score === 1 ? " coin" : " coins");
                pops.push({ x: it.x, y: it.y, life: 40 });
                items.splice(i,1);
              } else if(invuln === 0){
                life--;
                invuln = 90;
                lives.textContent = "❤️".repeat(Math.max(life,0)) || "—";
                items.splice(i,1);
                api.fail(function(){ if(life <= 0) over(); });
              }
            }
          }
          road = (road + speed) % 40;
        }

        draw();
      }

      function draw(){
        ctx.clearRect(0,0,W,H);

        ctx.fillStyle = "#F6F4EF"; ctx.fillRect(0,0,W,H);

        var pct = (DURATION - left) / DURATION;
        ctx.fillStyle = "#DCD6CA"; ctx.fillRect(0,0,W,2);
        ctx.fillStyle = "#1B5CFF"; ctx.fillRect(0,0,W*pct,2);

        ctx.fillStyle = "#16130F";
        ctx.fillRect(0, GROUND, W, H - GROUND);
        ctx.fillStyle = "#F6F4EF";
        for(var x = -road; x < W; x += 40) ctx.fillRect(x, GROUND + 26, 22, 2);

        items.forEach(function(it){
          if(it.img.complete) ctx.drawImage(it.img, it.x, it.y, it.w, it.h);
        });

        pops.forEach(function(p){
          p.life--; p.y -= 1.2;
          if(coinImg.complete){
            ctx.globalAlpha = Math.max(p.life/40, 0);
            ctx.drawImage(coinImg, p.x, p.y, 26, 26);
            ctx.globalAlpha = 1;
          }
        });
        pops = pops.filter(function(p){ return p.life > 0; });

        if(truck.complete && (invuln === 0 || t % 8 < 4)){
          ctx.drawImage(truck, 40, GROUND - TH + y, TW, TH);
        }
      }

      function over(){
        dead = true; stop();
        s.innerHTML = "";
        s.appendChild(api.carlos("The truck is dead. The universe suggests you try again."));
        s.appendChild(api.button("Restart the drive", "solid", function(){ api.go("uhaul"); }));
      }

      function win(){
        won = true; stop();
        s.innerHTML = "";
        s.appendChild(api.carlos(
          "You made it to Brooklyn with " + score + " coins and " +
          (life === 3 ? "not a scratch." : "some damage. Nobody's counting.")));
        var face = api.img(A.uhaulFace, "photo");
        face.style.maxHeight = "34vh";
        s.appendChild(face);
        s.appendChild(api.el("div", "hint", "Arrived"));
        s.appendChild(api.button("Continue", "solid", function(){
          window.removeEventListener("keydown", key);
          api.next();
        }));
      }

      loop();
    }
  };
})();
