window.GAMES.trash = {
  short: "Trash",

  mount: function(root, api){

    var QUESTIONS = [
      { type:"text",
        q:"What is Julie's new address?",
        accept: function(v){ return v.indexOf("322") >= 0 && v.indexOf("graham") >= 0; },
        nudge:"Number and street, Laura. You have been there.",
        ok:"Correct you can ship presents." },

      { type:"choice",
        q:"Why are all the car ads the same????",
        options:[
          { label:"Because men made them", say:"ily" },
          { label:"Because of the empty highway", say:"The highway is always empty. Why." },
          { label:"There is no answer", say:"obviously it's bc of the men." }
        ],
        free:true },

      { type:"choice",
        q:"What is the secret thing Julie really wants to do with you?",
        options:[
          { label:"Create stuff", correct:true },
          { label:"Shopping wink", say:"Naughty girl." },
          { label:"Make more eggs", say:"That is not a secret." }
        ],
        ok:"She has been waiting for you to say it." },

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
      { left:"5%",  top:"58%" }, { left:"22%", top:"70%" },
      { left:"38%", top:"55%" }, { left:"54%", top:"72%" },
      { left:"70%", top:"60%" }, { left:"84%", top:"48%" },
      { left:"14%", top:"30%" }, { left:"46%", top:"26%" },
      { left:"66%", top:"34%" }, { left:"30%", top:"44%" }
    ];

    var i = 0;
    var perQ = Math.ceil(SPOTS.length / QUESTIONS.length);

    root.appendChild(api.plate(4, "The OCD MCQ"));

    var s = api.stage();
    root.appendChild(s);

    var room = api.el("div","room");
    room.appendChild(api.img(A.livingroom, "bg"));

    var junk = SPOTS.map(function(sp, n){
      var j = api.img(A.trash[n % A.trash.length], "junk");
      j.style.left = sp.left;
      j.style.top = sp.top;
      j.style.transform = "rotate(" + (Math.random()*40 - 20).toFixed(0) + "deg)";
      room.appendChild(j);
      return j;
    });
    s.appendChild(room);

    var count = api.el("div","counter", SPOTS.length + " pieces of trash");
    s.appendChild(count);

    var line = api.el("div","note",
      "Answer correctly and the room cleans itself. That is not how cleaning works.");
    s.appendChild(line);

    var panel = api.el("div","choices");
    s.appendChild(panel);

    ask();

    function clean(){
      var from = i * perQ;
      for(var k = from; k < from + perQ && k < junk.length; k++){
        (function(j, d){
          setTimeout(function(){ j.classList.add("gone"); }, d * 140);
        })(junk[k], k - from);
      }
      var left = Math.max(SPOTS.length - (i + 1) * perQ, 0);
      count.textContent = left === 0 ? "spotless" :
        left + (left === 1 ? " piece of trash" : " pieces of trash");
    }

    function talk(text){
      line.textContent = text;
      line.className = "note";
      void line.offsetWidth;
      line.className = "note fade";
    }

    function advance(){
      clean();
      i++;
      if(i >= QUESTIONS.length){ setTimeout(finish, 900); }
      else { setTimeout(ask, 900); }
    }

    function ask(){
      var Q = QUESTIONS[i];
      panel.innerHTML = "";

      panel.appendChild(api.el("div","q", Q.q));

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
      clean1.style.maxHeight = "40vh";
      s.appendChild(clean1);

      s.appendChild(api.el("div","q","\u201Cit smells so good in here\u201D"));

      var bag = api.img(A.itsMyTrash, "photo");
      bag.style.maxHeight = "26vh";
      bag.style.opacity = "0";
      bag.style.transition = "opacity .5s ease";
      s.appendChild(bag);

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
