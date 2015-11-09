var powerMotorLeft  = brick.motor(M2);
var powerMotorRight = brick.motor(M4);
var udServo         = brick.motor(S5);
var handServo       = brick.motor(S6);

var udServoPos = 0;
var udStep = 0;
var handServoPos = 0;
var handStep = 0;

var servosOff = true;

gamepad.pad.connect(
  function(padId, x, y) {
    if (padId == 1) {
      if(servosOff) {
        servosOff = false;
        udTimer.start();
        handTimer.start();
      }
      /*
      udStep   = Math.abs(y) > 30 ? sign(-y) : 0;
      handStep =  ? sign(-x)  : 0;
      */
      udStep   = (Math.abs(y) > 30) ? (-y / 30) : 0;
      handStep = (Math.abs(x) > 20) ? (-x / 30) : 0;
    }

    if (padId == 2) {
      powerMotorLeft.setPower(y+x);
      powerMotorRight.setPower(y-x);
    }
  }
)

gamepad.padUp.connect(
  function(padId, x, y) {
    stopTimer.start();
    if (padId == 1) {
      udStep = 0;
      handStep = 0;
    } else if (padId == 2) {
      powerMotorLeft.powerOff();
      powerMotorRight.powerOff();
    }
  }
)

gamepad.button.connect(
  function(buttonId, pressed) {
    switch (buttonId) {
      case 1: {
        brick.say("Hello, i am TRIK");
        break;
      }
      case 2: {
        brick.sadSmile();
        script.wait(2000);
        brick.smile();
        break;
      }
      case 5: {
        brick.stop(); 
        script.wait(3000);
        script.system("/etc/init.d/mjpg-encoder-ov7670 restart");
      	script.system("/etc/init.d/mjpg-streamer-ov7670.sh restart");
      	print("mjpeg streamer started")
        break;
        
      }
      default: break;
    }
  }
)

var udMove = function() {
  udServoPos = trim(-100, udServoPos + udStep, 100);
  udServo.setPower(udServoPos);
}

var handMove = function() {
  handServoPos = trim(-100, handServoPos + handStep, 100);
  handServo.setPower(handServoPos);
}

var stopServos = function() {
  print("stop rule");

  udTimer.stop();
  udServo.powerOff();
  handTimer.stop();
  handServo.powerOff();
  servosOff = true;
  timer.stop();
}

var udTimer = script.timer(10);
udTimer.timeout.connect(udMove);
udTimer.stop();

var handTimer = script.timer(10);
handTimer.timeout.connect(handMove);
handTimer.stop();

var stopTimer = script.timer(5000);
stopTimer.timeout.connect(stopServos);
stopTimer.stop();

script.system("/etc/init.d/mjpg-encoder-ov7670 restart");
script.system("/etc/init.d/mjpg-streamer-ov7670.sh restart");
script.run();

var sign = function(a) {
  return a > 0 ? 1 : (a < 0 ? -1 : 0);
}

var trim = function(min, val, max) {
  if(val > max) return max;
  else if (val < min) return min;
  else return val;
}
