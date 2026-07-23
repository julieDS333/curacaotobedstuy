window.GAMES.tennis = (function(){
  var raf = null;

  function stop(){
    if(raf) cancelAnimationFrame(raf);
    raf = null;
  }

  return {
    short: "Tennis",
    unmount: stop,

    mount: function(root, api){
      stop();

      var NEED = 20;

      root.appendChild(api.plate(9, "Erratic Tennis"));

      var s = api.stage();
      root.appendChild(s);

      var hud = api.el("div","hud");
      var score = api.el("div","score","0 / " + NEED);
      var missBox = api.el("div", null, "\u2014");
      hud.appendChild(score);
      hud.appendChild(missBox);
      s.appendChild(hud);

      var court = api.el("div","court");
      court.style.backgroundImage = "url('" + api.url(A.court) + "')";
      s.appendChild(court);

      var ball = api.img(A.ball, "ball");
      court.appendChild(ball);

      var ring = api.el("div","ring");
      court.appendChild(ring);

      var line = api.el("div","note","Tap the ball. It will not cooperate.");
      s.appendChild(line);

      var W = 0, H = 0;
      var x = 0, y = 0, vx = 0, vy = 0;
      var hits = 0, misses = 0, alive = true, jerkIn = 0;

      function measure(){
        var r = court.getBoundingClientRect();
        W = r.width; H = r.height;
      }
      measure();
      window.addEventListener("resize", measure);

      function launch(){
        measure();
        x = W * 0.5;
        y = H * 0.5;
        var sp = 3.0 + hits * 0.26;
        var a = Math.random() * Math.PI * 2;
        vx = Math.cos(a) * sp;
        vy = Math.sin(a) * sp;
        jerkIn = 26 + Math.random() * 30;
      }

      function jerk(){
        var panic = hits >= NEED - 2;
        var sp = Math.sqrt(vx*vx + vy*vy);
        var turn = panic
          ? (Math.random() * 2.6 - 1.3) + (Math.random() < 0.4 ? Math.PI : 0)
          : (Math.random() * 1.0 - 0.5) + (Math.random() < 0.12 ? Math.PI : 0);
        var a = Math.atan2(vy, vx) + turn;
        var boost = panic
          ? 0.7 + Math.random() * 0.75
          : 0.94 + Math.random() * 0.14;
        vx = Math.cos(a) * sp * boost;
        vy = Math.sin(a) * sp * boost;
        jerkIn = panic
          ? 9 + Math.random() * 12
          : Math.max(18, 46 - hits * 1.5) + Math.random() * 22;
      }

      function talk(t){
        line.textContent = t;
        line.className = "note";
        void line.offsetWidth;
        line.className = "note fade";
      }

      court.addEventListener("pointerdown", function(e){
        if(!alive) return;
        var r = court.getBoundingClientRect();
        var px = e.clientX - r.left, py = e.clientY - r.top;

        ring.style.left = px + "px";
        ring.style.top = py + "px";
        ring.classList.remove("on");
        void ring.offsetWidth;
        ring.classList.add("on");

        var d = Math.hypot(px - x, py - y);
        if(d < 32){
          hits++;
          score.textContent = hits + " / " + NEED;
          if(hits >= NEED) return win();
          talk(hits === 10 ? "Halfway. It is getting worse." :
               hits === NEED - 2 ? "Two left. Good luck." : "Returned.");
          launch();
        } else {
          misses++;
          missBox.textContent = misses + (misses === 1 ? " miss" : " misses");
          var lost = hits > 0;
          if(lost) hits--;
          score.textContent = hits + " / " + NEED;
          api.fail(function(){
            talk(lost ? "Minus one. Watch the ball." : "You swung at nothing.");
          });
        }
      });

      function loop(){
        raf = requestAnimationFrame(loop);
        if(!alive) return;

        if(--jerkIn <= 0) jerk();

        x += vx; y += vy;

        var pad = 26;
        if(x < pad){ x = pad; vx = Math.abs(vx); }
        if(x > W - pad){ x = W - pad; vx = -Math.abs(vx); }
        if(y < pad){ y = pad; vy = Math.abs(vy); }
        if(y > H - pad){ y = H - pad; vy = -Math.abs(vy); }

        ball.style.left = x + "px";
        ball.style.top = y + "px";
      }

      function win(){
        alive = false;
        stop();
        window.removeEventListener("resize", measure);
        s.innerHTML = "";
        s.appendChild(api.carlos(
          misses === 0 ? "Twenty for twenty, no misses. Julie is going to hear about this."
                       : "Twenty returns. " + misses + " swings at open air. Still a win."));
        s.appendChild(api.button("Continue","solid",function(){ api.next(); }));
      }

      launch();
      loop();
    }
  };
})();
