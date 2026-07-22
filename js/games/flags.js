window.GAMES.flags = {
  short: "Flags",

  mount: function(root, api){
    var ROUNDS = [
      { name: "Curaçao",  shapes: A.curShapes, real: A.curacaoFlag,
        line: "Where you are. Build it." },
      { name: "New York", shapes: A.nyShapes,  real: A.nyFlag,
        line: "Where you are going. Build it faster." }
    ];

    var r = 0;

    root.appendChild(api.plate(2, "Assembly", "Two flags, disassembled — shapes on paper"));
    var s = api.stage();
    root.appendChild(s);

    startRound();

    function startRound(){
      var round = ROUNDS[r];
      var placed = [];
      s.innerHTML = "";

      s.appendChild(api.carlos(round.line));

      var frame = api.el("div", "buildframe");
      s.appendChild(frame);

      var count = api.el("div", "slots", "0 / " + round.shapes.length + " pieces");
      s.appendChild(count);

      var floor = api.el("div", "floor");
      s.appendChild(floor);

      var decoys = api.shuffle(A.decoyFlags).slice(0, 6);
      var pool = api.shuffle(
        round.shapes.map(function(n, i){ return { name: n, ok: true, order: i }; })
        .concat(decoys.map(function(n){ return { name: n, ok: false }; }))
      );

      var tiles = [];
      pool.forEach(function(p){
        var t = api.el("div", "tile");
        t.appendChild(api.img(p.name, ""));
        t.dataset.ok = p.ok ? "1" : "0";
        t.dataset.order = (p.order === undefined) ? "" : p.order;
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

      function redrawFrame(){
        frame.innerHTML = "";
        placed.slice().sort(function(a, b){ return a - b; }).forEach(function(i){
          frame.appendChild(api.img(round.shapes[i], ""));
        });
        count.textContent = placed.length + " / " + round.shapes.length + " pieces";
      }

      function pick(p, t){
        if(!p.ok){
          api.fail(scatter);
          return;
        }
        if(placed.indexOf(p.order) >= 0) return;
        placed.push(p.order);
        if(t.parentNode) t.parentNode.removeChild(t);
        redrawFrame();
        if(placed.length === round.shapes.length){ win(); }
        else { scatter(); }
      }

      function win(){
        s.innerHTML = "";
        s.appendChild(api.carlos(
          r === 0 ? "Correct. The universe is mildly surprised."
                  : "Both flags. You may proceed to the truck."
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
