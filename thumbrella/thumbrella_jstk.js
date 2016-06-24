var UD = brick.motor(M1);
var SQ = brick.motor(S6);
var R = brick.motor(M2);
var L = brick.motor(M3);

var jstk_pth = "/dev/input/by-path/platform-musb-hdrc-usb-0:1:1.0-event-joystick";
var yaw = 0;
var spd = 0;
var uds = 0;
var sqs = 0;
var jstk = brick.eventDevice(jstk_pth);

if (jstk != null) {
  brick.eventDevice(jstk_pth).on.connect(jstk_handle_event);
}

gamepad.pad.connect(
	function(padId, x, y) {
		if (padId == 2) {
			UD.setPower(-y);
			SQ.setPower(-x);
		}

		if (padId == 1) {
			L.setPower(y + x);
			R.setPower(-(-y + x));
		}
	}
)

gamepad.padUp.connect(
	function(padId, x, y) {
		if (padId == 2) {
			UD.powerOff();
			SQ.powerOff();
		} else if (padId == 1) {
			L.powerOff();
			R.powerOff();
		}
	}
)

gamepad.button.connect(
	function(buttonId, pressed) {
		if (pressed == 0) {
			return;
		}

		handle_button_down(buttonId);
	}
)

function jstk_handle_event(event_, code_, value_, eventTime_) {
  if(event_ != 0){
    switch(code_) {
      case PadEventCodes.X:
        yaw = value_*100/128;
        break;
      case PadEventCodes.Y:
        spd = -1*value_*100/128;
        break;
      case PadEventCodes.Throttle:
        uds = (value_-128)*100/128;
        break;
      case PadEventCodes.BtnY:
        if(value_)
          sqs = 100;
        else
          sqs = 0;
        break;
      case PadEventCodes.BtnTL:
        if(value_)
          sqs = -100;
        else
          sqs = 0;
        break;
        case PadEventCodes.BtnA:
          if(value_)
            handle_button_down(1);
          break;
        case PadEventCodes.BtnB:
          if(value_)
            handle_button_down(2);
          break;
        case PadEventCodes.BtnC:
          if(value_)
            handle_button_down(3);
          break;
      default:
        print("Unknown button code");
    }
    
    //print(event_, spd, yaw);
    
    R.setPower(spd - yaw);
    L.setPower(spd + yaw);
    UD.setPower(uds);
    SQ.setPower(sqs);
    
  }
}

function handle_button_down(buttonId) {
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
    case 4:
      brick.playTone(400, 1000);
      break;
  }
}

script.run();
