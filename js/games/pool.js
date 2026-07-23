window.GAMES.pool = {
  short: "Pool",

  mount: function(root, api){

    var i = 0;

    var QUESTIONS = [
      { type:"text",
        q:"Spell the name of your pool.",
        accept: function(v){ return v.indexOf("kosciuszko") >= 0 || v.indexOf("kosciusko") >= 0; },
        tries: 3,
        nudge:"Try again. It is Polish, not decorative.",
        giveup:"GenZ doesn't know how to write and read anymore apparently.",
        ok:"Correct. Kosciuszko. You may swim." },

      { type:"choice",
        q:"The architect who designed our pool was \u2014",
        options:[
          { label:"French" },
          { label:"British" },
          { label:"From Bed Stuy", correct:true }
        ],
        ok:"Local boy. He grew up two blocks from it.",
        no:"Technically Odessa. Practically Bed Stuy. The universe says Bed Stuy." },

      { type:"choice",
        q:"He also designed the Fontainebleau pool in Miami, which shows up in \u2014",
        options:[
          { label:"A Fast & Furious movie" },
          { label:"A James Bond movie", correct:true },
          { label:"A Beyonc\u00E9 video" }
        ],
        ok:"Goldfinger, 1964. Same architect, worse pool.",
        no:"No. Bond. It is always Bond." },

      { type:"choice",
        q:"What do people at this pool do most, on average?",
        options:[
          { label:"Swim" },
          { label:"Tan" },
          { label:"Gossip", correct:true }
        ],
        ok:"Correct. Nobody is swimming.",
        no:"Look around next time." },

      { type:"choice",
        q:"When is the next time we go to the pool?",
        options:[
          { label:"Tomorrow", correct:true },
          { label:"Tomorrow", correct:true },
          { label:"Tomorrow", correct:true }
        ],
        ok:"Correct. Obviously." }
    ];

    root.appendChild(api.plate(10, "Bedstuy Country Club"));

    var s = api.stage();
    root.appendChild(s);

    var shot = api.img(A.pool, "photo");
    shot.style.maxHeight = "30vh";
    s.appendChild(shot);

    var line = api.el("div","note","");
    line.style.minHeight = "24px";
    s.appendChild(line);

    var panel = api.el("div","choices");
    s.appendChild(panel);

    ask();

    function talk(t){
      line.textContent = t;
      line.className = "note";
      void line.offsetWidth;
      line.className = "note fade";
    }

    function advance(){
      i++;
      if(i >= QUESTIONS.length){ setTimeout(win, 800); }
      else { setTimeout(ask, 800); }
    }

    function ask(){
      var Q = QUESTIONS[i];
      panel.innerHTML = "";
      panel.appendChild(api.el("div","q", Q.q));

      if(Q.type === "text"){
        var left = Q.tries;

        var input = api.el("input","field");
        input.type = "text";
        input.setAttribute("autocomplete","off");
        input.setAttribute("autocapitalize","off");
        panel.appendChild(input);

        var counter = api.el("div","hint", left + " tries left");
        panel.appendChild(counter);

        var send = api.button("Answer","solid",function(){
          var v = (input.value || "").toLowerCase().trim();
          if(!v) return;
          if(Q.accept(v)){ talk(Q.ok); advance(); return; }
          left--;
          if(left <= 0){
            api.fail(function(){
              s.insertBefore(api.carlos(Q.giveup), line);
              advance();
            });
          } else {
            counter.textContent = left + (left === 1 ? " try left" : " tries left");
            api.fail(function(){ talk(Q.nudge); });
          }
        });
        panel.appendChild(send);

        input.addEventListener("keydown", function(e){
          if(e.key === "Enter") send.click();
        });

      } else {
        api.shuffle(Q.options).forEach(function(opt){
          panel.appendChild(api.button(opt.label, null, function(){
            if(opt.correct){ talk(Q.ok); advance(); }
            else { api.fail(function(){ talk(Q.no); }); }
          }));
        });
      }
    }

    function win(){
      s.innerHTML = "";
      s.appendChild(api.carlos("Membership confirmed. Bedstuy Country Club."));
      var p = api.img(A.pool, "photo");
      p.style.maxHeight = "36vh";
      s.appendChild(p);
      s.appendChild(api.button("Continue","solid",function(){ api.next(); }));
    }
  }
};
