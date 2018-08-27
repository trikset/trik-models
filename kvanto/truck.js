var wasActivity = false;

var lMotor = brick.motor(M1);
var rMotor = brick.motor(M2);

var wheelsMotor = brick.motor(S1);
var bodyMotor = brick.motor(S2);

var isLoad = true;

var load = function() {
	if (!isLoad) {
		for (var i = 0; i <= 90; i = i + 5) {
			bodyMotor.setPower(i);
			script.wait(200);
		}
		isLoad = true;
	}
	return true;
}

var upload = function() {
	if (isLoad) {
		for (var i = 90; i >= 0; i = i - 5) {
			bodyMotor.setPower(i);
			script.wait(200);
		}
		isLoad = false;
	}	
	return true;
}

var slightTurnLeft = function(x) {
	for (var i = 45; i >= x; i = i - 5) {
		wheelsMotor.setPower(i);
		script.wait(500);
	}
	return true;
}

var slightTurnRight = function(x) {
	for (var i = 45; i <= x; i = i + 5) {
		wheelsMotor.setPower(i);
		script.wait(500);
	}
	return true;
}

var controlSpeed = function(x) {
	lMotor.setPower(x);
	rMotor.setPower(x);
}

var controlTurn = function(x) {
	wheelsMotor.setPower((x + 100) / 200 * 90);
}

var stopMotors = function() {
	lMotor.powerOff();
	rMotor.powerOff();
}

// Gamepad mode

gamepad.pad.connect(
	function(pad, x, y) {
		wasActivity = true;
		if (pad == 1) {
			controlSpeed(y);
		} else {
			controlTurn(x);
		}
	}
)

gamepad.padUp.connect(
	function(pad, x, y) {
		wasActivity = true;
		if (pad == 1) {
			stopMotors();
		} else {
		// turn forward wheels to center
			controlTurn(0);
		}
	}
)

gamepad.button.connect(
	function(buttonId, pressed) {
		wasActivity = true;
		if (buttonId == 1) {
			upload();
		} else if (buttonId == 2) {
			load();
		}
	}
)

// Autonomus mode

var waitOrBreak = function(x) {
	for (var i = 0; i < x; i++) {
		if (!wasActivity) {
			script.wait(1000);		
		} else {
			return false;
		}
	}
	return true;
}

var startAutonomous = function() {
	slightTurnLeft(5)
	& waitOrBreak(2)
	& slightTurnLeft(45)
	& waitOrBreak(2)
	& slightTurnRight(85)
	& waitOrBreak(2)
	& slightTurnRight(45)
	& upload()
	& waitOrBreak(2)
	& load()
	& waitOrBreak(2);
}


var updateControlMode = function() {
	controlModeTimer.stop();
	
	wasActivity = false;
	script.wait(5000);
	if (!wasActivity) {
		startAutonomous();
	}
	
	controlModeTimer.start();
}


var controlModeTimer = script.timer(10000);
controlModeTimer.timeout.connect(updateControlMode);
controlModeTimer.start();

script.run();
