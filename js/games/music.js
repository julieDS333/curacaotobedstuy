window.GAMES.music = {
  short: "Interval",

  mount: function(root, api){

    root.appendChild(api.plate(5, "Intermission"));

    var s = api.stage();
    root.appendChild(s);

    var link = document.createElement("a");
    link.href = A.murderLink;
    link.target = "_blank";
    link.rel = "noopener";
    link.style.display = "block";
    link.style.maxWidth = "320px";

    var cover = api.img(A.murder, "photo");
    cover.style.maxHeight = "44vh";
    link.appendChild(cover);
    s.appendChild(link);

    s.appendChild(api.button("Continue","solid",function(){ api.next(); }));
  }
};
