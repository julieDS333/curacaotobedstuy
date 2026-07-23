var App = (function(){
  var idx = 0, current = null, cameoTimer = null;

  function url(name){ return ASSET_BASE + encodeURIComponent(name); }
  function $(sel){ return document.querySelector(sel); }

  function el(tag, cls, html){
    var n = document.createElement(tag);
    if(cls) n.className = cls;
    if(html !== undefined) n.innerHTML = html;
    return n;
  }

  function img(name, cls){
    var i = new Image();
    i.src = url(name);
    i.className = (cls === undefined) ? "asset" : cls;
    i.alt = "";
    return i;
  }

  function plate(n, title, sub){
    var p = el("div","plate");
    p.appendChild(el("div","no","Plate " + (n < 10 ? "0" + n : n)));
    p.appendChild(el("h1", null, title));
    if(sub) p.appendChild(el("p", null, sub));
    return p;
  }

  function carlos(text){
    var w = el("div","carlos");
    w.appendChild(img(A.carlos, ""));
    w.appendChild(el("div","say", text));
    return w;
  }

  function stage(){ return el("div","stage"); }

  function button(label, cls, onClick){
    var b = el("button", "btn" + (cls ? " " + cls : ""), label);
    b.addEventListener("click", onClick);
    return b;
  }

  function shuffle(arr){
    var a = arr.slice();
    for(var i = a.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function progress(){
    var pct = Math.round((idx / (GAME_ORDER.length - 1)) * 100);
    $("#journey-fill").style.width = pct + "%";
    $("#journey-step").textContent = (current && current.short) ? current.short : GAME_ORDER[idx];
  }

  /* nav strip: back + skip, on every screen */
  function nav(box){
    var bar = el("div","navbar");

    if(idx > 0){
      var b = el("button","back","\u2190 back");
      b.addEventListener("click", prev);
      bar.appendChild(b);
    } else {
      bar.appendChild(el("span","back",""));
    }

    if(idx < GAME_ORDER.length - 1){
      var f = el("button","back","skip \u2192");
      f.addEventListener("click", jumpNext);
      bar.appendChild(f);
    }

    box.appendChild(bar);
  }

  function render(id){
    if(current && typeof current.unmount === "function"){
      try { current.unmount(); } catch(e){}
    }

    var s = $("#screen");
    s.innerHTML = "";
    s.className = "";
    void s.offsetWidth;
    s.className = "fade";

    var g = window.GAMES[id];

    if(!g){
      console.warn("missing game:", id);
      current = null;
      nav(s);
      s.appendChild(el("div","plate",
        "<div class='no'>Not built yet</div><h1>" + id +
        "</h1><p>This room is still under construction.</p>"));
      var st = stage();
      st.appendChild(button("Back to the start","solid",reset));
      s.appendChild(st);
      progress();
      return;
    }

    current = g;
    nav(s);
    g.mount(s, API);
    progress();
    window.scrollTo(0, 0);
  }

  function go(id){
    var i = GAME_ORDER.indexOf(id);
    if(i >= 0) idx = i;
    save();
    render(id);
  }

  function prev(){
    if(idx <= 0) return;
    idx = idx - 1;
    save();
    render(GAME_ORDER[idx]);
  }

  /* testing jump: moves on even if the game isn't built */
  function jumpNext(){
    if(idx >= GAME_ORDER.length - 1) return;
    idx = idx + 1;
    save();
    render(GAME_ORDER[idx]);
  }

  function next(){ jumpNext(); }

  /* ---------- pistola fail ---------- */
  function fail(cb){
    var p = $("#pistola");
    p.querySelector("img").src = url(A.pistola);
    p.classList.add("on");
    $("#app").classList.add("shake");
    setTimeout(function(){
      p.classList.remove("on");
      $("#app").classList.remove("shake");
      if(cb) cb();
    }, 850);
  }

  /* ---------- random background intruders ---------- */
  function cameo(){
    var layer = $("#cameo");
    var name = CAMEOS[Math.floor(Math.random() * CAMEOS.length)];
    var i = img(name, "");
    i.style.top = (18 + Math.random() * 60) + "vh";
    i.style.animation = "flyby " + (4 + Math.random() * 3).toFixed(1) + "s linear forwards";
    layer.appendChild(i);
    setTimeout(function(){ if(i.parentNode) i.parentNode.removeChild(i); }, 8000);
  }

  function startCameos(){
    clearInterval(cameoTimer);
    cameoTimer = setInterval(function(){
      if(Math.random() < 0.5) cameo();
    }, 9000);
  }

  /* ---------- progress saving ---------- */
  function save(){ try{ localStorage.setItem("bedstuy", String(idx)); }catch(e){} }

  function load(){
    try{
      var v = parseInt(localStorage.getItem("bedstuy"), 10);
      if(!isNaN(v) && v >= 0 && v < GAME_ORDER.length) idx = v;
      if(location.search.indexOf("reset") >= 0) idx = 0;
    }catch(e){}
  }

  function reset(){
    try{ localStorage.removeItem("bedstuy"); }catch(e){}
    idx = 0;
    render(GAME_ORDER[0]);
  }

  /* ---------- preload everything up front ---------- */
  function preload(){
    var all = [];
    Object.keys(A).forEach(function(k){
      var v = A[k];
      if(typeof v === "string"){
        if(v.indexOf("http") !== 0) all.push(v);
      } else if(Array.isArray(v)){
        v.forEach(function(x){
          if(Array.isArray(x)) x.forEach(function(y){ all.push(y); });
          else all.push(x);
        });
      }
    });
    all.forEach(function(n){ var i = new Image(); i.src = url(n); });
  }

  var API = {
    url: url, el: el, img: img, plate: plate, carlos: carlos, stage: stage,
    button: button, shuffle: shuffle, next: next, prev: prev, go: go,
    fail: fail, cameo: cameo, reset: reset
  };

  function boot(){
    load();
    preload();
    startCameos();
    render(GAME_ORDER[idx]);
  }

  return { boot: boot, go: go, next: next, prev: prev, reset: reset, api: API };
})();

window.GAMES = window.GAMES || {};
document.addEventListener("contextmenu", function(e){ e.preventDefault(); }, false);
