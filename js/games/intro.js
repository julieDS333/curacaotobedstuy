window.GAMES.intro = {
  short: "Curaçao",

  mount: function(root, api){
    var beat = 0;

    var LINES = [
      "Laura. You might recognize me Carliiiito.",
      "While all those suckers are waiting in the airport",
      "Your gf made 10 games for you, including some you will hate.",
      "Flags ofc. You guessed it, a truck. Dragons...",
      "The univers also mentions a pombinha. WTF is a pombinha?.",
      "Ready?"
    ];

    var s = api.stage();

    var talk = api.carlos(LINES[0]);
    s.appendChild(talk);
    var say = talk.querySelector(".say");

    var tap = api.el("div", "hint", "Tap to continue");
    s.appendChild(tap);

    var startBtn = api.button("Take me to Bed Stuy", "solid", function(e){
      e.stopPropagation();
      api.next();
    });
    startBtn.style.display = "none";
    s.appendChild(startBtn);

    function advance(){
      beat++;
      if(beat >= LINES.length) return;
      say.textContent = LINES[beat];
      say.className = "say";
      void say.offsetWidth;
      say.className = "say fade";
      if(beat === LINES.length - 1){
        tap.style.display = "none";
        startBtn.style.display = "block";
        root.removeEventListener("click", advance);
      }
    }

    root.addEventListener("click", advance);
    root.appendChild(s);
  }
};
