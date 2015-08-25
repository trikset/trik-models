var servoPitch = brick.motor("E1");
var servoYaw   = brick.motor("E2");
var powerMotorRight = brick.motor("M1");
var powerMotorLeft = brick.motor("M2");

gamepad.pad.connect(
  function(padId, x, y) {
    if (padId == 1) {
      servoPitch.setPower(y);
      servoYaw.setPower(-x);
    }

    if (padId == 2) {
      powerMotorLeft.setPower(y + x);
      powerMotorRight.setPower(y - x);
    }
  } 
)

gamepad.padUp.connect(
  function(padId, x, y) {
    if (padId == 1) {
      servoPitch.powerOff();
      servoYaw.powerOff();
    } else if (padId == 2) {
      powerMotorLeft.powerOff();
      powerMotorRight.powerOff();
    }
  }
)

gamepad.button.connect(
  function(buttonId, pressed) {
    if (pressed == 0) {
      return;
    }

    switch (buttonId) {
      case 1: {
        brick.smile();
        break;
      }
      case 2: {
        brick.sadSmile();
        break;
      }
      case 3: {
        brick.say("Hello, i am TRIK");
        break;
      }
      case 5: {
        script.system("killall mjpg_streamer");
        script.system("killall mjpg_encoder");
        brick.quit();
      }
    }
  }
)

script.system("/etc/init.d/mjpg-encoder-ov7670.sh restart");
script.wait(3000);
script.system("/etc/init.d/mjpg-streamer-ov7670.sh restart");
script.run();
