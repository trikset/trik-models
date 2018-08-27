var wasActivity = false;

var motorStartPower = 50;
var motorMaxPower = 100;

var frontLMotor = brick.motor(M1);
var frontRMotor = brick.motor(M2);
var backMotor = brick.motor(M3);

var forkMotor = brick.motor(M4);

// Support (mathematics) functions

var sign = function(x) {
	return x > 0 ? 1 : (x < 0 ? -1 : 0);
}

var dot_product = function(a, b) {
	return a[0] * b[0] + a[1] * b[1];
}

var magnitude = function(a) {
	return Math.sqrt(dot_product(a, a));	
}

// Suppose that vector "a" is normalized (its' magnitude is equal to 1)
var cos_vectors = function(a, b) {
	return dot_product(a, b) / magnitude(b);
}

// Motion functions

var stopMotionMotors = function() {
	frontLMotor.powerOff();
	frontRMotor.powerOff();
	backMotor.powerOff();	
}

var rotate = function(x) {
	var rotationPower = sign(x) * 1.5 * motorStartPower;
	frontLMotor.setPower(rotationPower);
	frontRMotor.setPower(rotationPower);
	backMotor.setPower(rotationPower);
	return true;
}

var calculatePower = function(cos_between_vectors) {
	return sign(cos_between_vectors) * motorStartPower + cos_between_vectors * (motorMaxPower - motorStartPower);
}

var controlMotion = function(x, y) {	
	if (y * sign(y) < 10) {
		rotate(x);
	} else {
		var backMotorVector = [-1, 0];
		var frontLMotorVector = [0.5, Math.sqrt(3) / 2];
		var frontRMotorVector = [0.5, -Math.sqrt(3) / 2];
		
		var directionVector = [x, y];

		var backMotorVector_cos = cos_vectors(backMotorVector, directionVector);
		var frontLMotorVector_cos = cos_vectors(frontLMotorVector, directionVector);
		var frontRMotorVector_cos = cos_vectors(frontRMotorVector, directionVector);

		var backMotorPower = calculatePower(backMotorVector_cos);
		var frontLMotorPower = calculatePower(frontLMotorVector_cos);
		var frontRMotorPower = calculatePower(frontRMotorVector_cos);

		frontLMotor.setPower(frontLMotorPower);
		frontRMotor.setPower(frontRMotorPower);
		backMotor.setPower(backMotorPower);
	}
}

// Fork functions

var stopForkMotors = function() {
	forkMotor.powerOff();
	return true;
}

var controlFork = function(x) {
	forkMotor.setPower(x);
	return true;
}

// Gamepad mode

gamepad.disconnect.connect(
	function() {
		stopMotionMotors();
		stopForkMotors();		
	}
)

gamepad.pad.connect(
	function(padId, x, y) {
		wasActivity = true;
		if (padId == 1) {
			controlMotion(x, y);
		} else {
			controlFork(y);
		}
	}
)

gamepad.padUp.connect(
	function(padId) {
		wasActivity = true;
		if (padId == 1) {
			stopMotionMotors();
		} else {
			stopForkMotors();
		}
	}
)


gamepad.button.connect(
	function(buttonId, pressed) {
		wasActivity = true;
		if (buttonId == 1) {
			take();
		} else if (buttonId == 2) {
			put();					
		} 				
	}
)


// Autonomous mode

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
	rotate(-1)
	& waitOrBreak(3)
	& stopMotionMotors()
	& waitOrBreak(5)
	& controlFork(100)
	& waitOrBreak(3)
	& stopForkMotors()
	& waitOrBreak(3)
	& controlFork(0, -100)
	& waitOrBreak(3)
	& stopForkMotors()
	& waitOrBreak(3)
	& rotate(1)
	& waitOrBreak(3)
	& stopMotionMotors();
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

// Main loop

var controlModeTimer = script.timer(10000);
controlModeTimer.timeout.connect(updateControlMode);
controlModeTimer.start();

script.run();
