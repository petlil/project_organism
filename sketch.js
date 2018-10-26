//======== PROJECT ORGANISM ========
//========   PETER LILEY   ========
//final project of CMPO385 with Jim Murphy
//semester 2, 2018 @ NZSM

//This programme utilises the p5.play library. More info head here:
//http://molleindustria.github.io/p5.play/

//==== GRANULAR SYNTH VARIABLES ====
var counter1 = 0;
var counter2 = 0;
var soundArray1 = [];
var soundArray2 = [];
var envelopeArray1 = [];
var envelopeArray2 = [];
var numberOfFiles = 32;
var grainValue;
var distanceLR;
var distanceUD;
var sound1Volume;
var sound2Volume;
var squareSize = 500;
var squareX;
var squareY;
var minute;
var chordCounter = 0;

//==== MELODY CIRCLES VARIABLES ====
var numberofCircles = 8;
var timeInterval = 15000;
var circleArray = [];
var soundArray = [];
var backgroundValue = 0;
var buttonState = 0;
var buttonWidth = 100;
var backgroundFadeRate = 5;
var letterArray = ["O", "R", "G", "A", "N", "I", "S", "M"];

//==== GENERAL VARIABLES ====
var R = 163;
var bG = 165;
var bB = 195;

var masterChord = 2; //determines which of the 3 prepared chords is used

//=============================================================================
function preload(){
  //populate an array with individual .ogg files of the sound
  //to be granulated
  for(var i = 0; i<numberOfFiles; i++){
    soundArray1[i] = loadSound('assets/granulationFiles/granulationFile'+(i+1)+'.ogg');
    soundArray2[i] = loadSound('assets/granulationFiles/granulationAlternate copy '+(i+1)+'.ogg');
  }

  //populate an array with individual .ogg files of the 'melodic'
  //piano sound
  soundFormats('ogg');
  for(var i = 0; i<numberofCircles; i++){
    soundArray[i] = loadSound('assets/pianonote'+i+'.ogg');
  }
}

//=============================================================================
function setup(){
  createCanvas(windowWidth, windowHeight);
  squareX = (width/2) - (squareSize/2); //assign the x,y coordinates of the square's
  squareY = (height/2) - (squareSize/2); //top-left corner, for granulation reference

  //using the width of the screen and the width of the melody buttons to
  //determine a position that makes them centered
  var fullButtonSpreadWidth = buttonWidth*numberofCircles;
  var leftSideGap = ((width - fullButtonSpreadWidth)/2) + (buttonWidth/2);
  var buttonLineY = (height/2) - (squareSize/2) - (buttonWidth/2);

  //creating a sprite (from p5.play library) to follow the mouse
  spr = createSprite(width/2, height/2, 20, 20);
  spr.shapeColor = color(0);
  spr.rotateToDirection = false;
  spr.maxSpeed = 1;
  spr.friction = 0.1;
  spr.position.x;

  //create an array that stores an envelope for each file in the
  //granulation sound array (created in preload)
  for(var i = 0; i<numberOfFiles; i++){
    envelopeArray1[i] = new p5.Env;
    envelopeArray1[i].setRange(0.1,0);
    envelopeArray1[i].setADSR(0.01,0.3,0.05, 0.05);
    soundArray1[i].amp(envelopeArray1[i]);

    envelopeArray2[i] = new p5.Env;
    envelopeArray2[i].setRange(0.1,0);
    envelopeArray2[i].setADSR(0.01,0.3,0.05, 0.05);
    soundArray2[i].amp(envelopeArray2[i]);
  }

  textFont("georgia");

  //setting volumes and rates of melody buttons
  for(var i = 0; i<numberofCircles; i++){
    soundArray[i].setVolume(0.5);
    //playback speed determined by array index
    soundArray[i].rate(1/(i+1));
  }

  //instantiate the CirclePlayer objects (can be found in
  //filename 'sketch2' in the project folder)
  for(var i = 0; i < numberofCircles; i++){
    circleArray[i] = new CirclePlayer();
    circleArray[i].x = (i*buttonWidth)+leftSideGap;
    circleArray[i].y = buttonLineY;
    circleArray[i].load(soundArray[i]);
  }
}

//=============================================================================
function draw(){
  //background tends to black if set as another colour
  background(backgroundValue, 0, 0);
  if(backgroundValue > 0){
    backgroundValue = backgroundValue - backgroundFadeRate;
  }

  //at the end of every minute (internal computer time not programme run time)
  //the granulation frame shifts to encompass a different chord in the .ogg file
  var minute = second();
  if(minute%59 === 0){
    chordCounter = chordCounter + 1;
    masterChord = chordCounter%3;
  }

  //==== MELODY CIRCLE DRAW CODE ====
  fill(0);
  for(var i = 0; i < numberofCircles; i++){
    circleArray[i].letter(letterArray[i]);
    circleArray[i].draw();
  }

  //==== GRANULATION DRAW CODE ====
  fill(71,50,71);
  //rectMode(CENTER);
  rect(squareX, squareY, squareSize, squareSize);
  fill(0);

  //the small black square will follow the mouse as long as
  //it is within the bounds of the granulation box
  if(mouseX > squareX && mouseY > squareY &&
     mouseX < squareX + squareSize && mouseY < squareY + squareSize){
       if (mouseIsPressed) {
           spr.attractionPoint(0.5, mouseX, mouseY);
         }
     }

  drawSprites(); //a p5.play function

  //the %1 determines the rate of grain playback
  //(hard set to 60 grains/s for this programme)
   if(frameCount%1 === 0){
    playSound1();
    playSound2();
  }

  //the distance between the sprite and the left side of
  //the square determines the 'playhead' location for
  //the granulator
  distanceLR = dist(squareX, 0, spr.position.x, 0);

  if(masterChord === 0){
    grainValue = map(distanceLR, 0,squareSize, 0.05, 1.5);
  }
  else if (masterChord === 1){
    grainValue = map(distanceLR, 5,squareSize, 1.8, 3.3);
  }
  else if (masterChord === 2){
    grainValue = map(distanceLR, 5,squareSize, 3.5, 5);
  }

  //the distance between the sprite and the top of the
  //granulation square determines the mix between the
  //two .ogg file sets (piano / percussion)
  distanceUD = dist(0, squareY, 0, spr.position.y);
  sound1Volume = map(distanceUD, 0, squareSize, -.001, 0.05);
  sound2Volume = map(distanceUD, 0, squareSize, 0.05, -.001);
}

//===========================================================================
function mousePressed(){
  //if the mouse is within the bounds of any of the melody buttons,
  //the background is turned red (it tends back to black in the draw code)
  //and the selected button is activated with the 'clicked' function
  for(var i = 0; i < numberofCircles; i++){
    mouseDist = dist(circleArray[i].x, circleArray[i].y, mouseX, mouseY);
    if(mouseDist < buttonWidth/2 && buttonState <2){
      backgroundValue = 255;
    }
    circleArray[i].clicked(soundArray[i]);
  }
}

//============================================================================
function playSound1(){
  for(var i = 0; i<numberOfFiles; i++){
    //the counter ensures files are played in order, and no file
    //overlaps itself to cause a clip
    if(counter1%numberOfFiles === i){
      //jump the playhead to a random location within a
      //small time frame, set by the user through the GUI,
      //and play the envelope
      soundArray1[i].jump(random(grainValue-0.05, grainValue+0.05));
      envelopeArray1[i].setRange(sound1Volume, 0);
      envelopeArray1[i].play(null,0, .5);
    }
  }
    counter1 = counter1+1;
}

//=============================================================================
function playSound2(){
  for(var i = 0; i<numberOfFiles; i++){
    //the counter ensures files are played in order, and no file
    //overlaps itself to cause a clip
    if(counter2%numberOfFiles === i){
      //jump the playhead to a random location within a
      //small time frame, set by the user through the GUI,
      //and play the envelope
      soundArray2[i].jump(random(grainValue-0.05, grainValue+0.05));
      envelopeArray2[i].setRange(sound2Volume,0);
      envelopeArray2[i].play(null, 0, .5);}
  }
    counter2 = counter2+1;
}

//============================================================================
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
