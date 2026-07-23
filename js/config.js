/* Images live at the repo ROOT, so this stays an empty string. */
var ASSET_BASE = "";

var A = {
  carlos:      "carlos.png",
  curacao:     "curacao.jpeg",
  bedstuy:     "bedstuy.jpeg",
  julieLaura:  "julielaura.png",
  pistola:     "pistola1.jpeg",
  dove:        "dove.png",
  doveEggs:    "dove eggs.png",
  eggsBird:    "eggsbird.png",

  curacaoFlag: "flagcuracao.png",
  nyFlag:      "ny flag.png",
  curShapes:   ["Curacaoshape1.png","curacaoshape2.png","curacaoshape3.png","curacaoshape4.png"],
  nyShapes:    ["nyshape1.png","nyshape2.png","nyshape3.png","nyshape4.png"],
  decoyFlags:  ["flag1.png","flag2.png","flag3.png","flag4.png","flag6.png","flag7.png",
                "flag8.png","flag9.png","flag10.png","flag11.png","flag12.png",
                "flag13.png","flag14.png","Flag15.png"],

  uhaul:       "sideuhaul.png",
  uhaulFace:   "uhaulface.png",
  cars:        ["car1.png","car2.png","car3.png","car5.png"],
  coin:        "coin.png",
  dauphinois:  "dauphinois.png",
  tartar:      "tartar.png",

  livingroom:  "livingroom.png",
  trash:       ["trash1.png","trash2.png","trash3.png","trash4.png"],
  itsMyTrash:  "itsmytrash.png",

  murder:      "murderonthe.jpg.avif",
  murderLink:  "https://www.youtube.com/watch?v=-jY9U6qOeSw",

  julieAwake:  "julie's awake.png",
  julieSleeps: "julie sleeps.png",
  sofa:        "sofa.png",
  hotd:        ["house-of-the-dragon-season-3-_0.jpeg.webp","houseofdragon2.jpeg",
                "houseofdragon3.png","houseofdragon4.jpg","houseofdragon5.jpg"],

  beers:       ["beer1.jpg","beer2.jpeg","Beer3.jpeg","Beer 4.jpeg"],
  pantone:     ["pantonbeer1.png","pantonbeer2.png","pantonbeer3.png","pantonbeer4.png"],
  noPantone:   [["nobeer1.png","Nobeer11.png"],
                ["Nobeer2.png","Nobeer22.png"],
                ["Nobeer3.png","No beer33.png"],
                ["nobeer4.png","nobeer44.png"]],

  ball:        "usopenball-cutout.png",
  court:       "tennis court.png",
  pool:        "bedstuypool.jpeg"
};

/* order of the journey */
var GAME_ORDER = ["intro","flags","uhaul","trash","music","julie",
                  "beer","type","tennis","pool","nest","home"];

/* sprites that randomly wander through the background */
var CAMEOS = [A.dove, A.coin, A.dauphinois, A.tartar, A.uhaulFace];
