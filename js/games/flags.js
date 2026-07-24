window.GAMES.flags = {
  short: "Flags",

  mount: function(root, api){
    var ROUNDS = [
      { name: "Curaçao",  shapes: A.curShapes, real: A.curacaoFlag,
        line: "Where you are. Build it, piece by piece." },
      { name: "New York", shapes: A.nyShapes,  real: A.nyFlag,
        line: "Where you are going. Same deal, less patience from me." }
    ];

    var r = 0;

    root.appendChild(api.plate(2, "Vexy what ?!"));
    var s = api.stage();
    root.appendChild(s);

    startRound();

    function startRound(){
      var round = ROUNDS[r];
      var picked = [];
      s.innerHTML = "";

      s.appendChild(api.carlos(round.line));

      var box = api.el("div", "stack");
      box.appendChild(api.el("div", "empty", "empty"));
      s.appendChild(box);

      var count = api.el("div", "slots", "0 / " + round.shapes.length);
      s.appendChild(count);

      var floor = api.el("div", "floor");
      s.appendChild(floor);

      var decoys = api.shuffle(A.decoyFlags).slice(0, 6);
      var pool = api.shuffle(
        round.shapes.map(function(n){ return { name: n, ok: true }; })
          .concat(decoys.map(function(n){ return { name: n, ok: false }; }))
      );

      var tiles = [];
      pool.forEach(function(p){
        var t = api.el("div", "tile");
        t.appendChild(api.img(p.name, ""));
        t.addEventListener("click", function(){ pick(p, t); });
        floor.appendChild(t);
        tiles.push(t);
      });

      scatter();

      function scatter(){
        var live = tiles.filter(function(t){ return t.parentNode; });
        var cells = api.shuffle(live.map(function(_, i){ return i; }));
        live.forEach(function(t, i){
          var c = cells[i], col = c % 5, row = Math.floor(c / 5) % 2;
          t.style.left = (col * 19 + Math.random() * 4) + "%";
          t.style.top  = (row * 48 + 4 + Math.random() * 10) + "%";
          t.style.transform = "rotate(" + (Math.random() * 24 - 12).toFixed(1) + "deg)";
          t.classList.remove("hop");
          void t.offsetWidth;
          t.classList.add("hop");
        });
      }

      function pick(p, t){
        if(!p.ok){ api.fail(scatter); return; }
        if(picked.indexOf(p.name) >= 0) return;

        picked.push(p.name);
        if(t.parentNode) t.parentNode.removeChild(t);

        var layer = api.img(p.name, "");
        layer.className = "";
        box.appendChild(layer);
        var empty = box.querySelector(".empty");
        if(empty) empty.remove();

        count.textContent = picked.length + " / " + round.shapes.length;

        if(picked.length === round.shapes.length){ win(); }
        else { scatter(); }
      }

      function win(){
        s.innerHTML = "";
        s.appendChild(api.carlos(
          r === 0 ? "Correct. The universe is mildly surprised."
                  : "Both flags standing. Get in the truck."
        ));
        var real = api.img(round.real, "photo");
        real.style.maxHeight = "34vh";
        s.appendChild(real);
        s.appendChild(api.el("div", "hint", round.name));
        s.appendChild(api.button(
          r === 0 ? "Next flag" : "Continue",
          "solid",
          function(){
            if(r === 0){ r = 1; startRound(); }
            else { api.next(); }
          }
        ));
      }
    }
  }
};
