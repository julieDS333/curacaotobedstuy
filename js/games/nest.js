window.GAMES.nest = (function(){
  var raf = null, timers = [];

  function clearAll(){
    if(raf) cancelAnimationFrame(raf);
    raf = null;
    timers.forEach(clearTimeout);
    timers = [];
  }
  function later(fn, ms){ var id = setTimeout(fn, ms); timers.push(id); return id; }

  return {
    short: "Nest",
    unmount: clearAll,

    mount: function(root, api){
      clearAll();

      root.appendChild(api.plate(11, "Nest Watch"));

      var s = api.stage();
      root.appendChild(s);

      var meters = api.el("div","meters");

      function meter(label, cls){
        var m = api.el("div","meter");
        m.appendChild(api.el("div","lab", label));
        var bar = api.el("div","bar");
        var fill = api.el("div","fill " + cls);
        bar.appendChild(fill);
        m.appendChild(bar);
        meters.appendChild(m);
        return fill;
      }

      var warmFill = meter("Warmth","warm");
      var hatchFill = meter("Incubation","");
      s.appendChild(meters);

      var sky = api.el("div","sky");
      var eggs = api.img(A.doveEggs, "nest");
      sky.appendChild(eggs);

      var mama = api.img(A.dove, "mama");
      sky.appendChild(mama);

      s.appendChild(sky);

      var line = api.el("div","note","Hold the nest to keep them warm.");
      s.appendChild(line);

      /* ---- state ---- */
      var warmth = 60, hatch = 0, twigs = 0;
      var sitting = false, night = false, alive = true;
      var hawk = null, twig = null;

      function talk(t){
        line.textContent = t;
        line.className = "note";
        void line.offsetWidth;
        line.className = "note fade";
      }

      /* ---- sitting on the nest ---- */
      function sit(e){
        if(!alive) return;
        if(e.target.classList.contains("hawk")) return;
        if(e.target.classList.contains("twig")) return;
        e.preventDefault();
        sitting = true;
        mama.classList.add("on");
      }
      function stand(){
        sitting = false;
        mama.classList.remove("on");
      }

      sky.addEventListener("pointerdown", sit);
      sky.addEventListener("pointerup", stand);
      sky.addEventListener("pointercancel", stand);
      sky.addEventListener("pointerleave", stand);

      /* ---- day / night ---- */
      function cycle(){
        if(!alive) return;
        night = !night;
        sky.classList.toggle("night", night);
        talk(night ? "Night. It gets cold fast." : "Morning. Fetch a twig.");
        later(cycle, 9000);
      }
      later(cycle, 9000);

      /* ---- hawk ---- */
      function sendHawk(){
        if(!alive) return;
        if(!hawk){
          hawk = api.el("div","hawk","\uD83E\uDD85");
          hawk.style.left = "-14%";
          hawk.style.top = (12 + Math.random() * 26) + "%";
          hawk.addEventListener("pointerdown", function(e){
            e.stopPropagation();
            shoo();
          });
          sky.appendChild(hawk);
          talk("Hawk. Tap it.");

          later(function(){
            if(hawk){
              hawk.style.left = (30 + Math.random() * 40) + "%";
              hawk.style.top = "44%";
            }
          }, 60);

          later(function(){
            if(hawk && alive){
              hatch = Math.max(0, hatch - 14);
              api.fail(function(){ talk("It got close. You lost ground."); });
              removeHawk();
            }
          }, 2600);
        }
        later(sendHawk, 6000 + Math.random() * 6000);
      }
      function removeHawk(){
        if(hawk && hawk.parentNode) hawk.parentNode.removeChild(hawk);
        hawk = null;
      }
      function shoo(){
        if(!hawk) return;
        removeHawk();
        hatch = Math.min(100, hatch + 4);
        talk("Gone. Good.");
      }
      later(sendHawk, 4000);

      /* ---- twigs ---- */
      function dropTwig(){
        if(!alive) return;
        if(!twig){
          twig = api.el("div","twig","\uD83C\uDF3F");
          twig.style.left = (12 + Math.random() * 70) + "%";
          twig.style.top = (20 + Math.random() * 50) + "%";
          twig.addEventListener("pointerdown", function(e){
            e.stopPropagation();
            twigs++;
            warmth = Math.min(100, warmth + 16);
            hatch = Math.min(100, hatch + 5);
            talk("Twig collected. The nest holds heat better.");
            if(twig.parentNode) twig.parentNode.removeChild(twig);
            twig = null;
          });
          sky.appendChild(twig);

          later(function(){
            if(twig && twig.parentNode){ twig.parentNode.removeChild(twig); twig = null; }
          }, 4500);
        }
        later(dropTwig, 5000 + Math.random() * 5000);
      }
      later(dropTwig, 3000);

      /* ---- loop ---- */
      function loop(){
        raf = requestAnimationFrame(loop);
        if(!alive) return;

        var drain = night ? 0.26 : 0.14;
        var bonus = twigs * 0.012;

        if(sitting) warmth = Math.min(100, warmth + 0.38 + bonus);
        else warmth = Math.max(0, warmth - drain);

        if(warmth > 55) hatch = Math.min(100, hatch + 0.13);
        else if(warmth < 18) hatch = Math.max(0, hatch - 0.05);

        warmFill.style.width = warmth + "%";
        warmFill.className = "fill " + (warmth < 25 ? "low" : "warm");
        hatchFill.style.width = hatch + "%";

        if(warmth <= 0){
          warmth = 30;
          api.fail(function(){ talk("Too cold. Sit on them."); });
        }

        if(hatch >= 100) win();
      }

      function win(){
        alive = false;
        clearAll();
        removeHawk();
        if(twig && twig.parentNode) twig.parentNode.removeChild(twig);

        eggs.style.transition = "opacity .8s ease";
        eggs.style.opacity = "0";
        mama.classList.remove("on");

        var hatched = api.img(A.eggsBird, "nest");
        hatched.style.opacity = "0";
        hatched.style.transition = "opacity 1s ease";
        sky.appendChild(hatched);

        later(function(){ hatched.style.opacity = "1"; }, 500);

        talk("");
        later(function(){
          s.appendChild(api.carlos("Two eggs. Two babies. The cards were not subtle about this one."));
          s.appendChild(api.button("Continue","solid",function(){ api.next(); }));
        }, 1600);
      }

      loop();
    }
  };
})();
