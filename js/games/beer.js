window.GAMES.beer = {
  short: "Pantone",

  mount: function(root, api){

    /* order: warm to fully frozen. indexes into A.beers */
    var ORDER = [0, 1, 2, 3];

    /* quips per wrong swatch, keyed by filename */
    var QUIPS = {
      "Nobeer2.png":  "Are you drunk?",
      "Nobeer22.png": "That's in Julie's ear, not in a pint."
    };
    var GENERIC = [
      "No.",
      "Not even close.",
      "That is a different beverage.",
      "The universe disagrees."
    ];

    var r = 0, tries = 0;

    root.appendChild(api.plate(7, "Colour Matching",
      "Four beers, increasingly frozen \u2014 pigment on glass"));

    var s = api.stage();
    root.appendChild(s);

    round();

    function round(){
      var b = ORDER[r];
      tries = 0;
      s.innerHTML = "";

      s.appendChild(api.el("div","hint","Beer " + (r + 1) + " of " + ORDER.length));

      var shot = api.img(A.beers[b], "photo beershot");
      s.appendChild(shot);

      s.appendChild(api.el("div","q","Match the pantone."));

      var line = api.el("div","note","");
      line.style.minHeight = "24px";
      s.appendChild(line);

      var picks = api.shuffle([
        { name: A.pantone[b], ok: true },
        { name: A.noPantone[b][0], ok: false },
        { name: A.noPantone[b][1], ok: false }
      ]);

      var wrap = api.el("div","swatches");
      picks.forEach(function(p){
        var btn = api.el("button","swatch");
        btn.appendChild(api.img(p.name, ""));
        btn.addEventListener("click", function(){
          if(p.ok){ hit(btn, wrap); }
          else { missed(p.name, btn, line); }
        });
        wrap.appendChild(btn);
      });
      s.appendChild(wrap);
    }

    function missed(name, btn, line){
      tries++;
      btn.classList.add("dim");
      btn.disabled = true;
      var q = QUIPS[name] || GENERIC[Math.floor(Math.random() * GENERIC.length)];
      api.fail(function(){
        line.textContent = q;
        line.className = "note";
        void line.offsetWidth;
        line.className = "note fade";
      });
    }

    function hit(btn, wrap){
      Array.prototype.forEach.call(wrap.children, function(c){
        if(c !== btn) c.classList.add("dim");
        c.disabled = true;
      });
      r++;
      if(r >= ORDER.length){ setTimeout(win, 700); }
      else { setTimeout(round, 700); }
    }

    function win(){
      s.innerHTML = "";
      s.appendChild(api.carlos("Are you a designer?"));

      var last = api.img(A.beers[ORDER[ORDER.length - 1]], "photo beershot");
      s.appendChild(last);

      var chip = api.img(A.pantone[ORDER[ORDER.length - 1]], "");
      chip.style.width = "112px";
      chip.style.border = "1px solid var(--line)";
      chip.style.borderRadius = "6px";
      s.appendChild(chip);

      s.appendChild(api.el("div","hint","Your perfect beer"));
      s.appendChild(api.button("Continue","solid",function(){ api.next(); }));
    }
  }
};
