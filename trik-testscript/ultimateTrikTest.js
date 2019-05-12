var __interpretation_started_timestamp__;
var pi = 3.1415926535897931;
var SYMBOL_WIDTH = 10;
var SYMBOL_HEIGHT = 20;
var SCREEN_WIDTH = 240;
var SCREEN_HEIGHT = 279;
var SENSOR_CHECK_COUNTER = 2; // check every 1 sec, so for 2 checks you need to waitStatusText at least 3 sec
var waitStatusText = "...";
var errorStatusText = "errorStatusTextOR";
var successStatusText = "gud";

var testsMap = {"E1": waitStatusText, "E2": waitStatusText, "E3": waitStatusText, "E4": waitStatusText, "Gyro": waitStatusText, "Accel": waitStatusText, 
	"D1": waitStatusText, "D2": waitStatusText, "A1": waitStatusText, "A2": waitStatusText, "A3": waitStatusText, "A4": waitStatusText, "A5": waitStatusText, "A6": waitStatusText};

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
	var GA_TIMER = 100;
	// Gyroscope
	var gyroTimer = script.timer(GA_TIMER);
	gyroTimer.timeout.connect(function () {
		gyroTimer.stop();
		var A = brick.gyroscope().read()[0] == 0;
		var B = brick.gyroscope().read()[1] == 0;
		var C = brick.gyroscope().read()[2] == 0;
		if (!(A || B || C)) {
			testsMap["Gyro"] = successStatusText;
			return;
		}	
		gyroTimer.start();
	});
	
	// Accelerometer
	var accelTimer = script.timer(GA_TIMER);
	accelTimer.timeout.connect(function () {
		accelTimer.stop();
		var A = brick.accelerometer().read()[0] == 0;
		var B = brick.accelerometer().read()[1] == 0;
		var C = brick.accelerometer().read()[2] == 0;
		if (!(A || B || C)) {
			testsMap["Accel"] = successStatusText;
			return;
		}	
		accelTimer.start();
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
	
	
	
	//Main draw-clear function + camera test
	var page = 0;
	var mainMenuItems = ['1. Camera test', '2. Auto tested options'];
	var pos = 1;
	while (true) {
		switch (page) {
		case 0:
			var wordStartX = 1;
			var wordStartY = 1 * SYMBOL_HEIGHT + 10;// 10 beauty space;
		
			printCenter("Ultimate TRIK Test v0.3 ", 0);
			printCenter("Power button to exit ", SCREEN_HEIGHT - SYMBOL_HEIGHT * 2);
			brick.display().addLabel("Special thanks to bschepan ", wordStartX, SCREEN_HEIGHT - SYMBOL_HEIGHT);
			
			
			brick.display().setPainterWidth(2);
			brick.display().drawRect(1, wordStartY + (pos - 1) * SYMBOL_HEIGHT, SCREEN_WIDTH, SYMBOL_HEIGHT);
			
			for (var i = 0; i < mainMenuItems.length; i++) {
					brick.display().addLabel(mainMenuItems[i], 
						wordStartX, wordStartY + i * SYMBOL_HEIGHT);
			}
			brick.display().redraw();
			
			var max_pos = mainMenuItems.length;
			if (brick.keys().wasPressed(KeysEnum.Up)) {
				pos = pos - 1;
				if (pos < 1) {
					pos = max_pos;
				}
				brick.display().clear();
			}
			if (brick.keys().wasPressed(KeysEnum.Down)) {
				pos = pos + 1;
				if (pos > max_pos) {
					pos = 1;
				}
				brick.display().clear();
			}
			if (brick.keys().wasPressed(KeysEnum.Enter)) {
				page = pos;
				brick.display().clear();
				brick.display().redraw();
				brick.keys().reset();
				break;
			}
			
			break;
		case 1:
			if (brick.keys().wasPressed(KeysEnum.Esc)) {
				page = 0;
				previousMillis = 0;
				script.system("/etc/init.d/object-sensor-ov7670 -p 0 stop");
				script.system("/etc/init.d/object-sensor-ov7670 -p 1 stop");
				brick.display().clear();
				brick.display().redraw();
				brick.keys().reset();
				break;
			}
				var interval = 100;
				var waitCameraStop = 8;
				var waitCameraStart = 10;   // vars
				var previousMillis = 0;     // for waiting
				var loadCounter = 0; 	    // load process
				var step = 0;
			switch (step) {
			case 0: 
				brick.display().addLabel("Press Enter when the sensor",1, 70);
				brick.display().addLabel(" in port Video1 is ready",1, 90);
				brick.display().redraw();
				
				if (brick.keys().wasPressed(KeysEnum.Enter)) {
					step = 1;
					brick.display().clear();
					brick.display().redraw();
					brick.keys().reset();
				}
				break;
			case 1:
				printCenter("Port Video1", 70);
				printCenter("Initialization...", 90);
				brick.display().redraw();
			
				script.system("/etc/init.d/object-sensor-ov7670 -p 1 start");
				
				step = 2;
				break;
			case 2:
				var currentMillis = script.time();
				if (currentMillis - previousMillis > interval) {
					previousMillis = currentMillis;
					waitCounter++;
					if (waitCounter > waitCameraStart) {
						step = 3;
						waitCounter = 0;
						previousMillis = 0;
						brick.display().clear();
						printCenter("Enter to go to", 150);
						printCenter("the next Video2 port", 170);
						brick.display().redraw();
					}
				}
				break;
			case 3:
				if (brick.keys().wasPressed(KeysEnum.Enter)) {
					script.system("/etc/init.d/object-sensor-ov7670 -p 1 stop");
					step = 4;
					brick.keys().reset();
				}
				break;
			case 4:
				var currentMillis = script.time();
				if (currentMillis - previousMillis > interval) {
					previousMillis = currentMillis;
					waitCounter++;
					if (waitCounter > waitCameraStop) {
						step = 5;
						waitCounter = 0;
						previousMillis = 0;
						brick.display().clear();
						brick.display().redraw();
					}
				}
				break;
			case 5:
				brick.display().addLabel("Press Enter when the sensor",1, 70);
				brick.display().addLabel(" in port Video2 is ready",1, 90);
				brick.display().redraw();
				
				if (brick.keys().wasPressed(KeysEnum.Enter)) {
					step = 6;
					brick.display().clear();
					brick.display().redraw();
					brick.keys().reset();
				}
				break;
			case 6:
				printCenter("Port Video2", 70);
				printCenter("Initialization...", 90);
				brick.display().redraw();
			
				script.system("/etc/init.d/object-sensor-ov7670 -p 0 start");
				
				step = 7;
				break;
			case 7:
				var currentMillis = script.time();
				if (currentMillis - previousMillis > interval) {
					previousMillis = currentMillis;
					waitCounter++;
					if (waitCounter > waitCameraStart) {
						step = 8;
						waitCounter = 0;
						previousMillis = 0;
						brick.display().clear();
						printCenter("Enter to exit", 150);
						brick.display().redraw();
					}
				}
				break;
			case 8:
				if (brick.keys().wasPressed(KeysEnum.Enter)) {
					script.system("/etc/init.d/object-sensor-ov7670 -p 1 stop");
					step = 9;
					brick.keys().reset();
				}
				break;
			case 9:
				var currentMillis = script.time();
				if (currentMillis - previousMillis > interval) {
					previousMillis = currentMillis;
					waitCounter++;
					if (waitCounter > waitCameraStop) {
						step = 10;
						waitCounter = 0;
						previousMillis = 0;
						brick.display().clear();
						brick.display().redraw();
					}
				}
				break;
			case 10: 
				page = 0;
				brick.display().clear();
				brick.display().redraw();
				brick.keys().reset();
			}
			break;
		case 2:
			printCenter("Auto tested options", 0);
			
			var numberOfLines = 1;
			var wordStartX = 1;
			for (var key in testsMap) {
				brick.display().addLabel(key + ": " + testsMap[key], wordStartX, SYMBOL_HEIGHT * numberOfLines);
				numberOfLines++;
				if (numberOfLines > SCREEN_HEIGHT / SYMBOL_HEIGHT) {
					wordStartX = SCREEN_WIDTH / 2;
					numberOfLines = 1;
				}
			}
			
			if (brick.keys().wasPressed(KeysEnum.Esc)) {
				page = 0;
				brick.display().clear();
			}
		}
		
		brick.display().redraw();
		script.wait(200);
	}
	
	return;
}
