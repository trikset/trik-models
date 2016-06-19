var R  = brick.motor(M2); 
var L  = brick.motor(M4);

var UD = brick.motor(S5); // Up/Down
var SQ = brick.motor(S6); // Squeeze
var cam = brick.objectSensor("video0"); //Ball sensor

var avgSpeed   = 50;
var minTgtSize = 3;

var locs    = [0,0,0];
var locsOld = [0,0,0];
var locsTgt = [0,53,38];

var xPK = 0.5;
var xIK = 0;//.005;
var xDK = 0;//.25;

var paused = true;

var chasisMinSpeedC = 15;
var chasisMinSpeed = chasisMinSpeedC;
var chasisCoeff = 0.11;
var udMinSpeed = 0;

var squeeze = function() {
  print("done!")
  paused = true;
  stabled = false
  stableT.stop();
  stucked = false
  stuckedT.stop();

  L.setPower(0);
  R.setPower(0);
  UD.setPower(0);
  SQ.setPower(100);
  script.wait(4000);
  SQ.setPower(0);

  //up  
  UD.setPower(100);
  script.wait(1000);
  //turn
  L.setPower(-40);
  R.setPower(40);
  script.wait(2000);
  //stop
  UD.setPower(0);
  L.setPower(0);
  R.setPower(0);
  //unsq
  SQ.setPower(-100);
  script.wait(4000);
  SQ.setPower(0);
  
  //down
  UD.setPower(-100);
  script.wait(1000);
  //turn back
  L.setPower(40);
  R.setPower(-40);
  script.wait(2000);
  //stop
  UD.setPower(0);
  L.setPower(0);
  R.setPower(0);
}

var stabled = false;
var stableT = script.timer(1000);
stableT.stop();
stableT.timeout.connect(squeeze);

var unstuck = function() {
  chasisMinSpeed += 3;
  print("speed up!");
}

var stucked = false;
var stuckedT = script.timer(500);
stuckedT.stop();
stuckedT.timeout.connect(unstuck);

var trackingControl = function() {
  xd = Math.abs(locs[0] - locsTgt[0]);
  yd = Math.abs(locs[1] - locsTgt[1]);
  md = Math.abs(locs[2] - locsTgt[2]);
  print("x->", xd, "y->", yd, "m->", md);

  if ((xd < 10) && (yd < 5) && (md < 5)){ 
    if(!stabled) {
      stabled = true;
      stableT.start();
    }
  } else {
    if(stabled) {
      stabled = false;
      stableT.stop();
    }
  }
  
  xdo = Math.abs(locs[0] - locsOld[0]);
  ydo = Math.abs(locs[1] - locsOld[1]);
  mdo = Math.abs(locs[2] - locsOld[2]);
  
  if ((xdo < 2) && (ydo < 2) && (mdo < 2)) { 
    print("stucked");
    if(!stucked) {
      stucked = true;
      stuckedT.start();
//      print("start unstuck");
    }
  } else {
    print("unstucked");
    if(stucked) {
      stucked = false;
      chasisMinSpeed = chasisMinSpeedC;
      stuckedT.stop();
//      print("stop unstuck");
    }
  }
}

var trackingLoop = function() {
  locs = cam.read();
  print("locs:", locs[0], locs[1], locs[2]);

  if(!paused) {
    if(locs[2] <= minTgtSize) {
      R.setPower(0);
      L.setPower(0);
      print("Target lost!");
      return;
    }
    
    var x    = pp(locs[0],    -100, locsTgt[0], 100);
    var xold = pp(locsOld[0], -100, locsTgt[0], 100);
    var yaw = xPK*x + xIK*(x + xold) + xDK*(x - xold);

    var chasisSpeed     = pp(locs[2], 0,    locsTgt[2], 100); // back/forward based on ball size
    var chasisBackSpeed = pp(locs[1], -100, locsTgt[1], 100); // move back/forward if ball leaves range
    var chasisFinalSpeed = chasisSpeed + chasisBackSpeed;

    var armSpeed = pp(locs[1], -100, locsTgt[1], 100);

    R.setPower(chasisMinSpeed*sign(-chasisFinalSpeed) - chasisFinalSpeed*chasisCoeff - yaw);
    L.setPower(chasisMinSpeed*sign(-chasisFinalSpeed) - chasisFinalSpeed*chasisCoeff + yaw);
    
    //UD.setPower(udMinSpeed*sign(armSpeed) + armSpeed*2);
    udMove(armSpeed);

//    print("chasisSpeed yaw armSpeed bSPeed:", chasisFinalSpeed, yaw, armSpeed, chasisBackSpeed);
    trackingControl();
  } else {
//    R.setPower(0);
//    L.setPower(0);
//    UD.setPower(0);
    print("paused");
  }
  locsOld = locs;
}
var sign = function(a) {
  return a > 0 ? 1 : (a < 0 ? -1 : 0);
}

var pp = function(_val, _min, _zero, _max) {
  var adj = _val - _zero;
  if (adj > 0) {
    if (_val >= _max)
      return 100;
    else
      return (+100*(_val-_zero)) / (_max-_zero); // _max!=_zero, otherwise (_val>=_max) matches
  }
  else if (adj < 0) {
    if (_val <= _min)
      return -100;
    else
      return (-100*(_val-_zero)) / (_min-_zero); // _min!=_zero, otherwise (_val<=_min) matches
  }
  else
    return 0;
}

var detect = function() {
  cam.detect();
}

var fix = function() {
  locsTgt = cam.read();
  print("locsTgt:", locsTgt[0], locsTgt[1], locsTgt[2]);
}

var pause = function() {
  paused = !paused;
  R.setPower(0);
  L.setPower(0);
  UD.powerOff();
  SQ.powerOff();
}

brick.keys().buttonPressed.connect(
  function(code, value) {
    if (code == KeysEnum.Up && value == 0) { //пауза
      pause();
    } 
    if (code == KeysEnum.Left && value == 0) { //фиксирование положения и масссы объекта для захвата
      fix();
    }
    if (code == KeysEnum.Down && value == 0) { //детект объекта
      detect();
    } 
  }
);

var main = function() {
  cam.init(true);
 
  SQ.setPower(-100);
  script.wait(4000);
  SQ.setPower(0); 
  
  var mainT = script.timer(50);
  mainT.timeout.connect(trackingLoop);
  mainT.stop();
  mainT.start();

  script.run();
}
