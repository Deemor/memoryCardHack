const randomInt = (max) => Math.floor(Math.random() * Math.floor(max))
const delay = t => new Promise(res => setTimeout(res, t * 1000));

const SIGNS = ['X','Y','Z'];
var max_rounds = 10;
class Game
{
  array = [];
  amountOfTiles = 3;
  round = 0;
  constructor()
  {
    $("#mainSignsBoxRow").html("");
    for(let i = 0; i < 3; i++){
      this.array.push(SIGNS[randomInt(3)]);
    }
    for(let i = 0; i < this.amountOfTiles; i++){
      $("#mainSignsBoxRow").html($("#mainSignsBoxRow").html() + `<div class="col m-0 g-0"><div class="mainSignBox" id="b`+String(i)+`"><div class="container mainSignBoxTextTop text-end fw-bold" id="b`+String(i)+`TT"> `+String(i)+`</div><div class="container mainSignBoxTextBottom text-center fw-bold" id="b`+String(i)+`TB">X</div></div></div>`);
    }
  }

  createView(){
    $("#mainSignsBoxRow").html("");
    for(let i = 0; i < this.amountOfTiles - 1; i++){
      $("#mainSignsBoxRow").html($("#mainSignsBoxRow").html() + `<div class="col m-0 g-0"><div class="mainSignBoxFilled" id="b`+String(i)+`"><div class="container mainSignBoxTextTopFilled text-end fw-bold" id="b`+String(i)+`TT"> </div><div class="container mainSignBoxTextBottom text-center fw-bold" id="b`+String(i)+`TB"></div></div></div>`);
    }
    $("#mainSignsBoxRow").html($("#mainSignsBoxRow").html() + `<div class="col m-0 g-0"><div class="mainSignBox" id="b`+String(this.amountOfTiles - 1)+`"><div class="container mainSignBoxTextTop text-end fw-bold" id="b`+String(this.amountOfTiles - 1)+`TT"> </div><div class="container mainSignBoxTextBottom text-center fw-bold" id="b`+String(this.amountOfTiles - 1)+`TB"></div></div></div>`);
  }
  nextRound(){
    if(this.round != 0){
      this.array.shift();
      this.array.push(SIGNS[randomInt(3)]);
    }
    this.round += 1;
    $("#mainTextBottom").html(String(this.round) + "/" + String(max_rounds));
  }
  displayStartingViewData(){
    for(let i = 0; i < this.amountOfTiles; i++){
      $("#b"+String(i)+"TT").html(i+1);
      $("#b"+String(i)+"TB").html(this.array[i]);
    }
  }
  display(){
    for(let i = 0; i < this.amountOfTiles-1; i++){
      $("#b"+String(i)+"TT").html(this.round+i);
    }
    $("#b"+String(this.amountOfTiles - 1)+"TT").html(this.round + this.amountOfTiles - 1);
    $("#b"+String(this.amountOfTiles - 1)+"TB").html(this.array[this.amountOfTiles-1]);
  }

  isEqual(){
    if(this.array[0] == this.array[this.amountOfTiles-1]){
      return true;
    }else{
      return false;
    }
  }
}
var game;



async function startRound(){
  game.nextRound();
  game.display();

  return new Promise((output) => {
    document.addEventListener('keydown', onKeyHandler);
    function onKeyHandler(e) {
      if (event.keyCode === 37) {
        //left
        output(!game.isEqual());
      }else if (event.keyCode === 39) {
        //right
        output(game.isEqual());
      }
    }
  });
}

async function startHack(){
  result = true;
  game = new Game();
  game.displayStartingViewData();
  $("#mainTextBottom").html("PRZYGOTUJ SIĘ");
  var progBar = $("#progress-bar");
  progBar.css("width","100%");
  progBar.animate({
    width: "0px"
  }, {
    duration: 3*1000,
    ease: "linear",
  });
  await delay(3);
  game.createView();
  for(let i = 0;i < max_rounds; i++){
    if(!(await startRound())){
      result = false;
      break;
    }
  }
  if(!result){
    $("#mainTextBottom").html("BRAK DOSTĘPU");
    var progBar = $("#progress-bar");
    progBar.css("width","100%");
    progBar.animate({
      width: "0px"
    }, {
      duration: 3*1000,
      ease: "linear",
    });
    await delay(3);
  }else{
    $("#mainTextBottom").html("PRZYZNANO DOSTĘP");
    var progBar = $("#progress-bar");
    progBar.css("width","100%");
    progBar.animate({
      width: "0px"
    }, {
      duration: 3*1000,
      ease: "linear",
    });
    await delay(3);
  }

  $("#progress-bar").stop(true,true);
  return new Promise(async (output) => {
    output(0);
  });
}
async function start()
{
  await startHack();
  $('body').unbind('DOMSubtreeModified');
  $("#buttonDiv").show();
  $("#window").hide();
}
$("#buttonStart").on( "click", function() {
  $("#buttonDiv").hide();
  $("#window").show();
  start();
});
