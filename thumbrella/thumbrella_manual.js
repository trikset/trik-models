var UD = brick.motor(M1);
var SQ = brick.motor(S1);
var R = brick.motor(M2);
var L = brick.motor(M3);

brick.eventDevice.on.connect(
	function(event_, code_, value_, eventTime_) {
    var yaw = 0;
    var spd = 0;
    switch(code_) {
      case PadEventCodes.X:
        yaw = value_*100/128;
        break;
      case PadEventCodes.Y:
        spd = -1*value_*100/128;
        break;
      default:
        print("pew");
    }
  }
)
gamepad.pad.connect(
	function(padId, x, y) {
		if (padId == 2) {
			powerMotorArm.setPower(-y);
			servoYaw.setPower(-x);
		}

		if (padId == 1) {
			powerMotorLeft.setPower(y + x);
			powerMotorRight.setPower(-(-y + x));
		}
	}
)




gamepad.pad.connect(
	function(padId, x, y) {
		if (padId == 2) {
			powerMotorArm.setPower(-y);
			servoYaw.setPower(-x);
		}

		if (padId == 1) {
			powerMotorLeft.setPower(y + x);
			powerMotorRight.setPower(-(-y + x));
		}
	}
)

gamepad.padUp.connect(
	function(padId, x, y) {
		if (padId == 2) {
			powerMotorArm.powerOff();
			servoYaw.powerOff();
		} else if (padId == 1) {
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
			case 1: 
				brick.smile();
				break;
			case 2: 
				brick.sadSmile();
				break;
			case 3: 
				//brick.system("espeak -v russian_test -s 100 \"Hello, i am TRIK\"");
				brick.say("Hello, I am TRIK");
				break;
		}
	}
)

script.system("killall mjpg_streamer");
script.wait(1000);
script.system("mjpg_streamer -i \"input_uvc.so -d /dev/video2 -r 432x240 -f 30\" -o \"output_http.so -w /www\"");
script.run();
