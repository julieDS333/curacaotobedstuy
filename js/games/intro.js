window.GAMES.intro = {
  short: "Curaçao",

  mount: function(root, api){
    var beat = 0;

    var LINES = [
      "Laura. You are in Curaçao. Do not panic — I have seen the cards, and they say you are also in an airport.",
      "The universe has reviewed your flight status. The universe is not impressed either.",
      "There are ten trials between you and Brooklyn. Some are stupid. All of them count.",
      "It smells so good in here.",
      "…yes. It's my trash. Say the words, Laura."
    ];

    root.appendChild(api.plate(1, "Departure", "Curaçao — arrivals hall, oil on airport"));

    var s = api.stage();

    var photo = api.img(A.curacao, "photo");
    s.appendChild(photo);

    var talk = api.carlos(LINES[0]);
    s.appendChild(talk);

    var say = talk.querySelector(".say");

    var tap = api.el("div", "hint", "Tap to continue");
    s.appendChild(tap);

    var startBtn = api.button("Take me to Bed Stuy", "solid", function(){
      api.next();
    });
    startBtn.style.display = "none";
    s.appendChild(startBtn);

    function advance(){
      beat++;
      if(beat < LINES.length){
        say.textContent = LINES[beat];
        say.className = "say fade";
        void say.offsetWidth;
        if(beat === LINES.length - 1){
          tap.style.display = "none";
          startBtn.style.display = "block";
          root.removeEventListener("click", advance);
        }
      }
    }

    root.addEventListener("click", advance);

    root.appendChild(s);
  }
};
