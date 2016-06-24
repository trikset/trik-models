var powerMotorLeft  = brick.motor(M1);
var powerMotorRight = brick.motor(M2);

var scriptLines =
	"#put all script lines here\n"
  + "sleep 20\n"

var scriptToKill = "autorun." + new Date().getTime() + ".sh"
var scriptFileName = "/tmp/" + scriptToKill

script.writeToFile(scriptFileName, scriptLines);
script.system("chmod +x " + scriptFileName)

gamepad.pad.connect(
	function(padId, x, y) {
		powerMotorLeft.setPower(y+x);
		powerMotorRight.setPower(y-x);
	}
)

gamepad.padUp.connect(
	function(padId, x, y) {
		powerMotorLeft.powerOff();
		powerMotorRight.powerOff();
	}
)

gamepad.button.connect(
  function(buttonId, pressed) {
    switch (buttonId) {
      case 1: {
		var command = "killall -9 -q " + scriptToKill;
		script.system(command);
		brick.led().orange();
        break;
      }
      case 2: {
		var command = scriptFileName
			+ " && echo 1 > /sys/class/leds/led_red/brightness" 
			+ " && echo 1 > /sys/class/leds/led_green/brightness";

		brick.led().green();
		script.system(command);
        break;
      }
      default: break;
    }
  }
)

brick.led().orange();

script.run();
