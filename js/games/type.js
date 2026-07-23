window.GAMES.type = {
  short: "Type",

  mount: function(root, api){

    var ROUNDS = [
      { text:"We is a lot of people",
        font:'"American Typewriter", Georgia, serif',
        answer:"American Typewriter",
        wrong:["Courier","Rockwell","Clarendon"] },

      { text:"cubbyhole",
        font:'"Snell Roundhand", "Savoye LET", cursive',
        answer:"Snell Roundhand",
        wrong:["Lobster","Brush Script","Zapfino"] },

      { text:"zapataon",
        font:'"Zapfino", cursive',
        answer:"Zapfino",
        wrong:["Snell Roundhand","Edwardian Script","Apple Chancery"] },

      { text:"advantage De Sousa",
        font:'"Didot", "Bodoni 72", Georgia, serif',
        answer:"Didot",
        wrong:["Bodoni","Baskerville","Playfair"] },

      { text:"Pistola",
        font:'"Copperplate", "Copperplate Gothic Light", fantasy',
        answer:"Copperplate",
        wrong:["Optima","Futura","Peignot"] }
    ];

    var i = 0;

    root.appendChild(api.plate(8, "Typographer",
      "Don't get distracted by the steak tartar"));

    var s = api.stage();
    root.appendChild(s);

    round();

    function round(){
      var R = ROUNDS[i];
      s.innerHTML = "";

      s.appendChild(api.el("div","hint",
        "Specimen " + (i + 1) + " of " + ROUNDS.length));

      var spec = api.el("div", R.text.length > 14 ? "specimen small" : "specimen", R.text);
      spec.style.fontFamily = R.font;
      s.appendChild(spec);

      var line = api.el("div","note","");
      line.style.minHeight = "24px";
      s.appendChild(line);

      var panel = api.el("div","choices");
      s.appendChild(panel);

      api.shuffle([R.answer].concat(R.wrong)).forEach(function(name){
        panel.appendChild(api.button(name, null, function(){
          if(name === R.answer){ hit(panel); }
          else { missed(name, line); }
        }));
      });
    }

    function missed(name, line){
      api.fail(function(){
        line.textContent = "Not " + name + ".";
        line.className = "note";
        void line.offsetWidth;
        line.className = "note fade";
      });
    }

    function hit(panel){
      Array.prototype.forEach.call(panel.children, function(b){ b.disabled = true; });
      i++;
      if(i >= ROUNDS.length){ setTimeout(win, 600); }
      else { setTimeout(round, 600); }
    }

    function win(){
      s.innerHTML = "";
      s.appendChild(api.carlos("Five for five. This is your actual job, so I am not applauding."));
      s.appendChild(api.button("Continue","solid",function(){ api.next(); }));
    }
  }
};
