window.GAMES.intro = {
  short: "Curaçao",

  mount: function(root, api){
    var beat = 0;

    var LINES = [
      "Laura. You might recognize me, Carlos.",
      "You are in an airport. I am an oracle. Neither of us chose this.",
      "The universe has looked at your departure time and declined to comment.",
      "Ten trials stand between this terminal and your apartment. Flags. A truck. A woman who will fall asleep...",
      "The cards mention a pombinha. WTF is a pombinha?.",
      "Ready?"
    ];

    root.appendChild(api.plate(1, "Departure", "Curaçao — indefinite delay, mixed media"));

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
