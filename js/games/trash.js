window.GAMES.trash = {
  short: "Trash",

  mount: function(root, api){

    var QUESTIONS = [
      { type:"text",
        q:"What is Julie's new address?",
        accept: function(v){ return v.indexOf("322") >= 0 && v.indexOf("graham") >= 0; },
        nudge:"Number and street, Laura. You have been there.",
        ok:"Correct. You may keep the keys." },

      { type:"choice",
        q:"Why are all the car ads the same????",
        options:[
          { label:"Because men made them", say:"Sure. Still the same." },
          { label:"Because of the drone shot", say:"The drone shot is not the point." },
          { label:"Because of the empty highway", say:"The highway is always empty. Why." },
          { label:"There is no answer", say:"Correct. There is no answer. Nobody knows." }
        ],
        free:true,
        ok:"The universe has no comment on car advertising." },

      { type:"choice",
        q:"What is the secret thing Julie really wants to do with you?",
        options:[
          { label:"Create stuff", correct:true },
          { label:"Shopping", say:"Naughty girl." },
          { label:"Make more eggs", say:"That is not a secret." }
        ],
        ok:"Correct. She has been waiting for you to say it." },

      { type:"text",
        q:"What is Julie's favourite festa?",
        accept: function(v){ return v.indexOf("bolinho") >= 0; },
        nudge:"Small. Fried. You know this one.",
        ok:"Bolinho. Obviously." },

      { type:"text",
        q:"When is our wedding?",
        accept: function(v){ return v.indexOf("july") >= 0 || v.indexOf("julho") >= 0 ||
                                     v.indexOf("juillet") >= 0; },
        nudge:"A month. Adrian is already free that day.",
        ok:"July. Hurry up girl." }
    ];

    var SPOTS = [
      { img:A.trash[0], left:"6%",  top:"52%" },
      { img:A.trash[1], left:"36%", top:"64%" },
      { img:A.trash[2], left:"64%", top:"48%" },
      { img:A.trash[3], left:"18%", top:"22%" },
      { img:A.trash[0], left:"72%", top:"72%" }
    ];

    var i = 0;

    root.appendChild(api.plate(4, "The Living Room",
      "Bed Stuy, interior — refuse, questions, one woman"));

    var s = api.stage();
    root.appendChild(s);

    /* room */
    var room = api.el("div","room");
    var bg = api.img(A.livingroom, "bg");
    room.appendChild(bg);

    var junk = SPOTS.map(function(sp){
      var j = api.img(sp.img, "junk");
      j.style.left = sp.left;
      j.style.top = sp.top;
      room.appendChild(j);
      return j;
    });
    s.appendChild(room);

    var count = api.el("div","counter", SPOTS.length + " pieces of trash");
    s.appendChild(count);

    var carlosBox = api.carlos("Answer correctly and the room cleans itself. That is not how cleaning works, but here we are.");
    s.appendChild(carlosBox);
    var say = carlosBox.querySelector(".say");

    var panel = api.el("div","choices");
    s.appendChild(panel);

    ask();

    function clean(){
      if(junk[i]) junk[i].classList.add("gone");
      var left = SPOTS.length - (i + 1);
      count.textContent = left === 0 ? "spotless" :
        left + (left === 1 ? " piece of trash" : " pieces of trash");
    }

    function talk(text){
      say.textContent = text;
      say.className = "say";
      void say.offsetWidth;
      say.className = "say fade";
    }

    function advance(){
      clean();
      i++;
      if(i >= QUESTIONS.length){ setTimeout(finish, 700); }
      else { setTimeout(ask, 700); }
    }

    function ask(){
      var Q = QUESTIONS[i];
      panel.innerHTML = "";

      var q = api.el("div","q", Q.q);
      panel.appendChild(q);

      if(Q.type === "text"){
        var input = api.el("input","field");
        input.type = "text";
        input.setAttribute("autocomplete","off");
        input.setAttribute("autocapitalize","off");
        panel.appendChild(input);

        panel.appendChild(api.button("Answer","solid",function(){
          var v = (input.value || "").toLowerCase().trim();
          if(!v) return;
          if(Q.accept(v)){ talk(Q.ok); advance(); }
          else { talk(Q.nudge); api.fail(); }
        }));

        input.addEventListener("keydown", function(e){
          if(e.key === "Enter") panel.querySelector(".btn").click();
        });

      } else {
        api.shuffle(Q.options).forEach(function(opt){
          panel.appendChild(api.button(opt.label, null, function(){
            if(Q.free){ talk(opt.say); advance(); return; }
            if(opt.correct){ talk(Q.ok); advance(); }
            else { talk(opt.say); api.fail(); }
          }));
        });
      }
    }

    function finish(){
      s.innerHTML = "";

      var clean1 = api.img(A.livingroom, "photo");
      clean1.style.maxHeight = "36vh";
      s.appendChild(clean1);

      var line1 = api.el("div","q","\u201Cit smells so good in here\u201D");
      s.appendChild(line1);

      var bagWrap = api.el("div", null);
      var bag = api.img(A.itsMyTrash, "photo");
      bag.style.maxHeight = "26vh";
      bag.style.opacity = "0";
      bag.style.transition = "opacity .5s ease";
      bagWrap.appendChild(bag);
      s.appendChild(bagWrap);

      var line2 = api.el("div","q","");
      s.appendChild(line2);

      var go = api.button("Continue","solid",function(){ api.next(); });
      go.style.display = "none";
      s.appendChild(go);

      setTimeout(function(){ bag.style.opacity = "1"; }, 900);
      setTimeout(function(){
        line2.textContent = "\u201Cyes \u2014 it's my trash\u201D";
        line2.className = "q fade";
      }, 1500);
      setTimeout(function(){ go.style.display = "block"; }, 2200);
    }
  }
};
