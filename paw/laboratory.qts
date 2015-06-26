//var gamepad = brick.gamepad();

var BUDe = brick.encoder(B4); 
var BUD = brick.motor(M4); //big up-down
var LLR = brick.motor(C3); //little left-right
var LUD = brick.motor(C2); //little up-down
var LRO = brick.motor(C1); //little rotate
var LSQ = brick.motor(E3); //little squeeze

LLR.setPower(0);
LUD.setPower(0);
LRO.setPower(0);
LSQ.setPower(100);
BUDe.reset();

script.wait(1000);
brick.stop();
while(true) {
  //wake up, unsqueeze
  LUD.setPower(0);
  LSQ.setPower(100);
  script.wait(500);
  //squeeze
  LSQ.setPower(-100);
  script.wait(500);

  //move right
  for(i=0; i < 50; i++) {
    LLR.setPower(i);
    script.wait(5);
  }

  //pour off
  script.wait(500);
  LRO.setPower(100);
  script.wait(1000);
  LRO.setPower(0);
  script.wait(500);
  LRO.powerOff();

  
  //move left
  print("left");
  for(i=50; i > -50; i--) {        
    LLR.setPower(i);             
    script.wait(10);               
  } 
  script.wait(500);

  
  //put down, unsqeeze
  print("down");
  BUD.setPower(-50);
  while(BUDe.read() < 1000) {
    script.wait(10);
  }
  BUD.setPower(0);
  LSQ.setPower(100);
  script.wait(1000);
  
  BUD.setPower(50);
  while(BUDe.read() >= 0) {
    script.wait(10);
  }
  BUD.setPower(0);
  script.wait(500);
i
  //go home
  for(i=-50; i < 0; i++) {        
    LLR.setPower(i);             
    script.wait(10);               
  } 

  script.wait(1000);
  brick.stop();
  script.wait(3000);
}

script.run();
