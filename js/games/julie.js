window.GAMES.julie = (function(){
  var timers = [];

  function clearAll(){
    timers.forEach(clearTimeout);
    timers = [];
  }

  function later(fn, ms){
    var id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  return {
    short: "Sofa",
    unmount: clearAll,

    mount: function(root, api){
      clearAll();

      var NEED = 5;
      var WINDOWS = [1600, 1350, 1150, 950, 800];

      var got = 0, asleep = false, armed = false;

      root.appendChild(api.plate(6, "Keep Julie Awake",
        "Brooklyn, evening \u2014 one sofa, one series, one problem"));

      var s = api.stage();
      root.appendChild(s);

      var pips = api.el("div","pips");
      var dots = [];
      for(var k = 0; k < NEED; k++){
        var d = api.el("div","pip");
        pips.appendChild(d);
        dots.push(d);
      }
      s.appendChild(pips);

      var couch = api.el("div","couch");

      var tv = api.el("div","tv");
      tv.style.backgroundImage = "url('" + api.url(A.hotd[0]) + "')";
      couch.appendChild(tv);

      var sofa = api.img(A.sofa, "sofa");
      couch.appendChild(sofa);

      var her = api.img(A.julieAwake, "her");
      couch.appendChild(her);

      var zzz = api.el("div","zzz","z z z");
      couch.appendChild(zzz);

      s.appendChild(couch);

      var line = api.el("div","note","She is watching. For now.");
      s.appendChild(line);

      her.addEventListener("click", tickle);
      couch.addEventListener("click", function(e){
        if(e.target !== her) miss();
      });

      schedule();

      function talk(t){
        line.textContent = t;
        line.className = "note";
        void line.offsetWidth;
        line.className = "note fade";
      }

      function schedule(){
        var wait = 1200 + Math.random() * 2600;
        later(sleep, wait);
      }

      function sleep(){
        asleep = true;
        armed = true;
        her.src = api.url(A.julieSleeps);
        zzz.classList.add("on");
        talk("Tickle her.");
        later(function(){
          if(asleep && armed) miss();
        }, WINDOWS[got]);
      }

      function wake(){
        asleep = false;
        armed = false;
        her.src = api.url(A.julieAwake);
        zzz.classList.remove("on");
      }

      function tickle(e){
        e.stopPropagation();
        if(!asleep){
          talk("She is already awake. Leave her alone.");
          return;
        }
        armed = false;
        wake();
        got++;
        dots[got - 1].classList.add("on");

        if(got >= NEED){ return win(); }

        tv.style.backgroundImage = "url('" + api.url(A.hotd[got]) + "')";
        talk("Saved. Episode continues.");
        schedule();
      }

      function miss(){
        if(!asleep) return;
        armed = false;
        wake();
        api.fail(function(){
          talk("Gone. She missed the whole scene. Again.");
          schedule();
        });
      }

      function win(){
        clearAll();
        zzz.classList.remove("on");
        tv.style.backgroundImage = "url('" + api.url(A.hotd[4]) + "')";
        tv.style.opacity = ".85";
        talk("Credits. She stayed awake. Barely.");
        her.removeEventListener("click", tickle);
        later(function(){
          s.appendChild(api.button("Continue","solid",function(){ api.next(); }));
        }, 1200);
      }
    }
  };
})();
