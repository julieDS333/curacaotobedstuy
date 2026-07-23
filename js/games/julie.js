window.GAMES.julie = (function(){
  var timers = [], tick = null;

  function clearAll(){
    timers.forEach(clearTimeout);
    timers = [];
    if(tick) clearInterval(tick);
    tick = null;
  }
  function later(fn, ms){ var id = setTimeout(fn, ms); timers.push(id); return id; }

  return {
    short: "Sofa",
    unmount: clearAll,

    mount: function(root, api){
      clearAll();

      var LIMIT = 5000;
      var ROUNDS = [
        { kiss:5,  choc:10 },
        { kiss:10, choc:11 },
        { kiss:16, choc:12 },
        { kiss:20, choc:13 },
        { kiss:25, choc:14 }
      ];

      var r = 0, kiss = 0, choc = 0, live = false;

      root.appendChild(api.plate(6, "Keep Julie Awake"));

      var s = api.stage();
      root.appendChild(s);

      var pips = api.el("div","pips");
      var dots = [];
      for(var k = 0; k < ROUNDS.length; k++){
        var d = api.el("div","pip");
        pips.appendChild(d);
        dots.push(d);
      }
      s.appendChild(pips);

      var couch = api.el("div","couch");
      var tv = api.el("div","tv");
      tv.style.backgroundImage = "url('" + api.url(A.hotd[0]) + "')";
      couch.appendChild(tv);
      couch.appendChild(api.img(A.sofa, "sofa"));
      var her = api.img(A.julieAwake, "her");
      couch.appendChild(her);
      s.appendChild(couch);

      var clock = api.el("div","clock","\u2014");
      s.appendChild(clock);

      var tally = api.el("div","tally","");
      s.appendChild(tally);

      var senders = api.el("div","senders");
      var bk = api.button("\uD83D\uDC8B  Send kisses", null, function(){ send("kiss"); });
      var bc = api.button("\uD83C\uDF6B  Send food", null, function(){ send("choc"); });
      senders.appendChild(bk);
      senders.appendChild(bc);
      s.appendChild(senders);

      var line = api.el("div","note","She is watching. For now.");
      s.appendChild(line);

      var goBtn = api.button("Start","solid", startRound);
      s.appendChild(goBtn);

      draw();

      function talk(t){
        line.textContent = t;
        line.className = "note";
        void line.offsetWidth;
        line.className = "note fade";
      }

      function draw(){
        var R = ROUNDS[r];
        tally.innerHTML = "\uD83D\uDC8B <b>" + kiss + "</b> / " + R.kiss +
                          " &nbsp;&nbsp; \uD83C\uDF6B <b>" + choc + "</b> / " + R.choc;
      }

      function fly(emoji){
        var f = api.el("div","flyer", emoji);
        f.style.left = (30 + Math.random() * 40) + "%";
        f.style.bottom = "18%";
        couch.appendChild(f);
        setTimeout(function(){ if(f.parentNode) f.parentNode.removeChild(f); }, 1200);
      }

      function send(kind){
        if(!live) return;
        if(kind === "kiss"){ kiss++; fly("\uD83D\uDC8B"); }
        else { choc++; fly("\uD83C\uDF6B"); }
        draw();
        var R = ROUNDS[r];
        if(kiss >= R.kiss && choc >= R.choc) done();
      }

      function startRound(){
        kiss = 0; choc = 0; live = true;
        goBtn.style.display = "none";
        her.src = api.url(A.julieSleeps);
        draw();
        talk("She is out. Send everything.");

        var end = Date.now() + LIMIT;
        clock.textContent = "5.0";
        tick = setInterval(function(){
          var leftMs = end - Date.now();
          if(leftMs <= 0){
            clearInterval(tick); tick = null;
            clock.textContent = "0.0";
            if(live) fail();
          } else {
            clock.textContent = (leftMs / 1000).toFixed(1);
          }
        }, 80);
      }

      function stopClock(){
        if(tick){ clearInterval(tick); tick = null; }
      }

      function done(){
        live = false;
        stopClock();
        her.src = api.url(A.julieAwake);
        r++;
        dots[r - 1].classList.add("on");

        if(r >= ROUNDS.length){ return win(); }

        tv.style.backgroundImage = "url('" + api.url(A.hotd[r]) + "')";
        talk("Awake. For about four seconds.");
        clock.textContent = "\u2014";
        kiss = 0; choc = 0;
        draw();
        goBtn.textContent = "Next round";
        goBtn.style.display = "block";
      }

      function fail(){
        live = false;
        stopClock();
        api.fail(function(){
          her.src = api.url(A.julieAwake);
          talk("She slept through it. Start again.");
          kiss = 0; choc = 0;
          draw();
          clock.textContent = "\u2014";
          goBtn.textContent = "Try again";
          goBtn.style.display = "block";
        });
      }

      function win(){
        live = false;
        stopClock();
        clearAll();
        tv.style.backgroundImage = "url('" + api.url(A.hotd[4]) + "')";
        clock.textContent = "\u2014";
        senders.style.display = "none";
        talk("Credits. She stayed awake. Barely.");
        later(function(){
          s.appendChild(api.button("Continue","solid",function(){ api.next(); }));
        }, 1000);
      }
    }
  };
})();
