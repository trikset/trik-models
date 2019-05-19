var __interpretation_started_timestamp__;
var pi = 3.1415926535897931;
var SYMBOL_WIDTH = 10;
var SYMBOL_HEIGHT = 20;
var SCREEN_WIDTH = 240;
var SCREEN_HEIGHT = 279;
var CAMERA_CHECK_VALUE = 371;
var SENSOR_CHECK_COUNTER = 2; // check every 1 sec, so for 2 checks you need to waitStatusText at least 3 sec
var waitStatusText = "...";
var errorStatusText = "ERROR";
var successStatusText = "gud";
include("artagTest.js"); ///////////////// tmp path /home/root/trik/scripts/

var testsMap = {"E1": waitStatusText, "E2": waitStatusText, "E3": waitStatusText, "E4": waitStatusText,
	"Gyro": waitStatusText, "Accel": waitStatusText, "D1": waitStatusText, "D2": waitStatusText, "A1": waitStatusText,
	"A2": waitStatusText, "A3": waitStatusText, "A4": waitStatusText, "A5": waitStatusText, "A6": waitStatusText,
	"Camera": waitStatusText, "Esc": waitStatusText, "Enter": waitStatusText, "Up": waitStatusText,
	"Down": waitStatusText, "Left": waitStatusText, "Right": waitStatusText};

var printCenter = function (text, y) {
	brick.display().addLabel(text, (SCREEN_WIDTH - text.length * SYMBOL_WIDTH)/2, y);
}

function encoderTest(motor, encoder, timer, previousValue) {
	timer.stop();
	var currentValue = brick.encoder(encoder).read();
	brick.encoder(encoder).reset();
	
	brick.motor(motor).setPower(-1 * brick.motor(motor).power());
	
	if (previousValue * currentValue < 0) {
		testsMap[encoder] = successStatusText;
		brick.motor(motor).powerOff();
	}
	else {
		if (previousValue != 0 && currentValue != 0) {
			testsMap[encoder] = errorStatusText;
		}
		timer.start();
	}
	return currentValue;
}

function sensorTest(sensor, timer, counter, benchmark, range) {
	timer.stop;
	var tmp = (brick.sensor(sensor).read() - benchmark) * (brick.sensor(sensor).read() - benchmark);
	testsMap[sensor] = brick.sensor(sensor).read(); // until not benchmark - showing data	
	if (tmp < range * range) {
		counter++;
		if (counter >= SENSOR_CHECK_COUNTER) {
			testsMap[sensor] = successStatusText;
			return 0;
		}
	} 
	else {
		counter = 0;
	}
	timer.start();
	return counter;
}

function gaTest(sensor, timer) {
	timer.stop();
	var value = brick.accelerometer().read();
	var A = value[0] == 0;
	var B = value[1] == 0;
	var C = value[2] == 0;
	print("" sensor + " " + value);
	
	if (!(A || B || C))
			testsMap[sensor] = successStatusText;
	else 
		timer.start();	
}

var main = function()
{
	__interpretation_started_timestamp__ = Date.now();
	
	brick.display().clear();
	brick.display().redraw();
	
	for (var i = 1; i <= 6; i++) {
		brick.motor('S' + i).setPower(100);
	}
	for (var i = 1; i <= 4; i++) {
		brick.motor('M' + i).setPower(100);
	}

	///Motors encoders
	var MOTORS_TIMER = 2000;
	
	//E1 M1 test
	var prevE1Value = 0;
	var e1Timer = script.timer(MOTORS_TIMER);
	e1Timer.timeout.connect(function () {
		prevE1Value = encoderTest(M1, E1, e1Timer, prevE1Value);
	});
	
	//E2 M2 test
	var prevE2Value = 0;
	var e2Timer = script.timer(MOTORS_TIMER);
	e2Timer.timeout.connect(function () {
		prevE2Value = encoderTest(M2, E2, e2Timer, prevE2Value);
	});
	
	//E3 M3 test
	var prevE3Value = 0;
	var e3Timer = script.timer(MOTORS_TIMER);
	e3Timer.timeout.connect(function () {
		prevE3Value = encoderTest(M3, E3, e3Timer, prevE3Value);
	});
	
	//E4 M4 test
	var prevE4Value = 0;
	var e4Timer = script.timer(MOTORS_TIMER);
	e4Timer.timeout.connect(function () {
		prevE4Value = encoderTest(M4, E4, e4Timer, prevE4Value);
	});
	
	///GA
	//Среднее по движению
	var GA_TIMER = 100;
	// Gyroscope
	var gyroTimer = script.timer(GA_TIMER);
	gyroTimer.timeout.connect(function () {
		gaTest("Gyro", gyroTimer);
	});
	
	// Accelerometer
	var accelTimer = script.timer(GA_TIMER);
	accelTimer.timeout.connect(function () {
		gaTest("Accel", accelTimer);
	});
	
	// USensors
	var DSENSOR_TIMER = 1000;
	var DSensorRange = 100;
	var DSensorBenchmark = 123456;
	
	var d1Counter = 0;
	var d1Timer = script.timer(DSENSOR_TIMER);
	d1Timer.timeout.connect(function () {
		d1Counter = sensorTest(D1, d1Timer, d1Counter, DSensorBenchmark, DSensorRange);
	});
	
	var d2Counter = 0;
	var d2Timer = script.timer(DSENSOR_TIMER);
	d2Timer.timeout.connect(function () {
		d2Counter = sensorTest(D2, d2Timer, d2Counter, DSensorBenchmark, DSensorRange);
	});
	
	//AnalogSensor
	var ASENSOR_TIMER = 1000;
	var ASensorRange = 100;
	var ASensorBenchmark = 123456;
	
	var a1Counter = 0;
	var a1Timer = script.timer(ASENSOR_TIMER);
	a1Timer.timeout.connect(function () {
		a1Counter = sensorTest(A1, a1Timer, a1Counter, ASensorBenchmark, ASensorRange);
	});
	
	var a2Counter = 0;
	var a2Timer = script.timer(ASENSOR_TIMER);
	a2Timer.timeout.connect(function () {
		a2Counter = sensorTest(A2, a2Timer, a2Counter, ASensorBenchmark, ASensorRange);
	});
	
	var a3Counter = 0;
	var a3Timer = script.timer(ASENSOR_TIMER);
	a3Timer.timeout.connect(function () {
		a3Counter = sensorTest(A3, a3Timer, a3Counter, ASensorBenchmark, ASensorRange);
	});
	
	var a4Counter = 0;
	var a4Timer = script.timer(ASENSOR_TIMER);
	a4Timer.timeout.connect(function () {
		a4Counter = sensorTest(A4, a4Timer, a4Counter, ASensorBenchmark, ASensorRange);
	});
	
	var a5Counter = 0;
	var a5Timer = script.timer(ASENSOR_TIMER);
	a5Timer.timeout.connect(function () {
		a5Counter = sensorTest(A5, a5Timer, a5Counter, ASensorBenchmark, ASensorRange);
	});
	
	var a6Counter = 0;
	var a6Timer = script.timer(ASENSOR_TIMER);
	a6Timer.timeout.connect(function () {
		a6Counter = sensorTest(A6, a6Timer, a6Counter, ASensorBenchmark, ASensorRange);
	});
		
	var CAMERA_TIMER = 1000;
	var artagValue = 0;
	var cameraTimer = script.timer(CAMERA_TIMER);
	cameraTimer.timeout.connect(function () {
		cameraTimer.stop();
		artagValue = artagTest();
		print(artagValue);
		if (artagValue == CAMERA_CHECK_VALUE) {
			testsMap["Camera"] = successStatusText;
		}
		else {
			testsMap["Camera"] = artagValue;
			cameraTimer.start();
		}
	});
	
	//Main draw-clear function + camera test
	var page = 0;
	var pos = 1;
	while (true) {
			var wordStartX = 1;
			var wordStartY = 1 * SYMBOL_HEIGHT + 10;// 10 beauty space;
		
			printCenter("TRIK Test v1.0", 0);
			printCenter("Power button to exit ", SCREEN_HEIGHT - SYMBOL_HEIGHT * 2);
			brick.display().addLabel("Special thanks to bschepan ", wordStartX, SCREEN_HEIGHT - SYMBOL_HEIGHT);
			
			var numberOfLines = 1;
			for (var key in testsMap) {
				brick.display().addLabel(key + ": " + testsMap[key], wordStartX, SYMBOL_HEIGHT * numberOfLines);
				numberOfLines++;
				if (numberOfLines > (SCREEN_HEIGHT - SYMBOL_HEIGHT * 2) / SYMBOL_HEIGHT) {
					wordStartX = SCREEN_WIDTH / 2;
					numberOfLines = 1;
				}
			}
			
			if (brick.keys().wasPressed(KeysEnum.Esc)) {
				testsMap["Esc"] = successStatusText;
			}
			if (brick.keys().wasPressed(KeysEnum.Enter)) {
				testsMap["Enter"] = successStatusText;
			}
			if (brick.keys().wasPressed(KeysEnum.Down)) {
				testsMap["Down"] = successStatusText;
			}
			if (brick.keys().wasPressed(KeysEnum.Up)) {
				testsMap["Up"] = successStatusText;
			}
			if (brick.keys().wasPressed(KeysEnum.Left)) {
				testsMap["Left"] = successStatusText;
			}
			if (brick.keys().wasPressed(KeysEnum.Right)) {
				testsMap["Right"] = successStatusText;
			}
		
		brick.display().redraw();
		script.wait(200);
	}
	
	return;
}