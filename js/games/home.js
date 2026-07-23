window.GAMES.home = (function(){
  var timers = [];

  function clearAll(){
    timers.forEach(clearTimeout);
    timers = [];
  }
  function later(fn, ms){ var id = setTimeout(fn, ms); timers.push(id); return id; }

  return {
    short: "Bed Stuy",
    unmount: clearAll,

    mount: function(root, api){
      clearAll();

      root.appendChild(api.plate(12, "Arrival"));

      var s = api.stage();
      root.appendChild(s);

      var shot = api.el("div","arrival");
      shot.style.backgroundImage = "url('" + api.url(A.bedstuy) + "')";
      s.appendChild(shot);

      var title = api.el("div","welcome","Welcome back to Bed Stuy");
      title.style.opacity = "0";
      title.style.transition = "opacity .8s ease";
      s.appendChild(title);

      var beer = api.img(A.beers[3], "photo");
      beer.style.maxHeight = "24vh";
      beer.style.opacity = "0";
      beer.style.transition = "opacity .8s ease";
      s.appendChild(beer);

      var beerCap = api.el("div","hint","Freezing. Waiting.");
      beerCap.style.opacity = "0";
      beerCap.style.transition = "opacity .8s ease";
      s.appendChild(beerCap);

      var letter = api.el("div","letter",
        "<p>You made it through flags, traffic, my trash, my sleeping, " +
        "four beers, five typefaces, one impossible tennis ball, " +
        "a country club and two eggs.</p>" +
        "<p>The airport was never the point. Come home.</p>" +
        "<p class='sign'>\u2014 Julie</p>");
      letter.style.opacity = "0";
      letter.style.transition = "opacity .8s ease";
      s.appendChild(letter);

      var july = api.el("div","july","and in July, Adrian is still free");
      july.style.opacity = "0";
      july.style.transition = "opacity 1.2s ease";
      s.appendChild(july);

      var again = api.button("Play it again","", function(){ api.reset(); });
      again.style.opacity = "0";
      again.style.transition = "opacity .8s ease";
      s.appendChild(again);

      later(function(){ title.style.opacity = "1"; }, 600);
      later(function(){ beer.style.opacity = "1"; beerCap.style.opacity = "1"; }, 1600);
      later(function(){ letter.style.opacity = "1"; }, 2600);
      later(function(){ july.style.opacity = "1"; }, 4200);
      later(function(){ again.style.opacity = "1"; }, 5200);

      /* a small shower of doves on arrival */
      var n = 0;
      (function rain(){
        if(n++ > 6) return;
        api.cameo();
        later(rain, 900);
      })();
    }
  };
})();
