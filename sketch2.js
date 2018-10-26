function CirclePlayer(){
  this.x;
  this.y;
  this.rate;
  this.textLetter;


  this.buttonSize = buttonWidth;
  buttonState = 0;
  this.timer = 10000000000000;

  this.load = function(loadedSound){
    this.amp = new p5.Amplitude();
    this.amp.setInput(loadedSound);

  }

  this.draw = function(){
    this.level = this.amp.getLevel();
    this.levelColour = map(this.level, 0, 0.005, 0, 75)
    fill(bB + this.levelColour,bG,bB);
    noStroke();
    ellipse(this.x, this.y, this.buttonSize);
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text(this.textLetter, this.x, this.y);

    if(millis() - this.timer > timeInterval){
      this.buttonReset();
      this.timer = 10000000000000;
      bR = 163;
      bG = 165;
      bB = 195;
    }
  }

  this.clicked = function(soundToPlay){
    this.radius = this.buttonSize/2;
    if(dist(mouseX, mouseY, this.x, this.y) < this.radius){
      if(buttonState === 0){
        soundToPlay.play();
        buttonState = 1;
      }
      else if(buttonState === 1){
        soundToPlay.play();
        buttonState = 2;
        this.timer = millis();
        bG = 50;
        bB = 71;
      }
    }
  }

  this.buttonReset = function(){
    buttonState = 0;
    print('ready');
  }

  this.letter = function(input){
    this.textLetter = input;
  }

}
