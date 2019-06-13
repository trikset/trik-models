var __interpretation_started_timestamp__;
var pi = 3.1415926535897931;
var SYMBOL_WIDTH = 10;
var SYMBOL_HEIGHT = 20;
var SCREEN_WIDTH = 240;
var SCREEN_HEIGHT = 279;
var CAMERA_CHECK_VALUE = 371;
var SENSOR_CHECK_COUNTER = 2; // check every 1 sec, so for 2 checks you need to waitStatusText at least 3 sec
var GA_CHECK_VALUE = 100;
var waitStatusText = "...";
var errorStatusText = -1;
var successStatusText = "ok";
var timeStart = Date.now();
 
include("/home/root/trik/scripts/artagTest.js"); ///////////////// tmp path /home/root/trik/scripts/
	
var edTests = {"E1": waitStatusText, "E2": waitStatusText, "E3": waitStatusText, "E4": waitStatusText, 
	"D1": waitStatusText, "D2": waitStatusText};

var aTests = {"A1": waitStatusText, "A2": waitStatusText, "A3": waitStatusText, "A4": waitStatusText, 
	"A5": waitStatusText, "A6": waitStatusText};

var agTests = {"Gyro": waitStatusText, "Accel": waitStatusText};

//🞫 ✔ ▲ ▼ ◀ ▶
var buttonTests = {"Esc": waitStatusText, "Enter": waitStatusText, "Up": waitStatusText, "Down": waitStatusText, 
	"Left": waitStatusText, "Right": waitStatusText};

var cameraTests = {"Camera": waitStatusText};

var consoleOutput = {"E1": waitStatusText, "E2": waitStatusText, "E3": waitStatusText, "E4": waitStatusText,
	"Gyro": waitStatusText, "Accel": waitStatusText, "D1": waitStatusText, "D2": waitStatusText, "A1": waitStatusText,
	"A2": waitStatusText, "A3": waitStatusText, "A4": waitStatusText, "A5": waitStatusText, "A6": waitStatusText,
	"Camera": waitStatusText, "Esc": waitStatusText, "Enter": waitStatusText, "Up": waitStatusText,
	"Down": waitStatusText, "Left": waitStatusText, "Right": waitStatusText};

var printCenter = function (text, y) {
	brick.display().addLabel(text, (SCREEN_WIDTH - text.length * SYMBOL_WIDTH) / 2, y);
}

var printStatus = function (text, y, status) {
	brick.display().setPainterColor("Black");
	brick.display().addLabel(text, 1, y);
	var i = 0;
	for (var key in status) {
		if (status[key] == successStatusText) {
			brick.display().setPainterColor("Green");
		}
		else {
			brick.display().setPainterColor("Red");
		}
		
		brick.display().drawRect(text.length * SYMBOL_WIDTH + (i * (SYMBOL_WIDTH + 5)), y, SYMBOL_WIDTH, SYMBOL_HEIGHT - 2, true);
		i++;
	}


}

function encoderTest(motor, encoder, timer, previousValue) {
	timer.stop();
	var currentValue = brick.encoder(encoder).read();
	consoleOutput[encoder] = currentValue;
	brick.encoder(encoder).reset();
	
	brick.motor(motor).setPower(-1 * brick.motor(motor).power());
	
	if (previousValue * currentValue < 0) {
		edTests[encoder] = successStatusText;
		brick.motor(motor).powerOff();
	}
	else {
		if (previousValue != 0 && currentValue != 0) {
			edTests[encoder] = errorStatusText;
		}
		timer.start();
	}
	return currentValue;
}

function sensorTest(sensor, timer, counter, benchmark, range, tests) {
	timer.stop;
	var currentValue = brick.sensor(sensor).read();
	var tmp = (currentValue - benchmark) * (currentValue - benchmark);
	consoleOutput[sensor] = currentValue;
	if (tmp < range * range) {
		counter++;
		if (counter >= SENSOR_CHECK_COUNTER) {
			tests[sensor] = successStatusText;
			return 0;
		}
	} 
	else {
		counter = 0;
	}
	timer.start();
	return counter;
}

function gaTest(sensorName, sensor, timer) { // Attention!!
	timer.stop();
	var value = sensor.read();
	var A = value[0] > GA_CHECK_VALUE || value[0] < (-1) * GA_CHECK_VALUE;
	var B = value[0] > GA_CHECK_VALUE || value[0] < (-1) * GA_CHECK_VALUE;
	var C = value[0] > GA_CHECK_VALUE || value[0] < (-1) * GA_CHECK_VALUE;
	consoleOutput[sensorName] = "" + value[0] + " " + value[1] + " " + value[2];
	
	if (!(A || B || C))
			agTests[sensorName] = successStatusText;
	else 
		timer.start();	
}

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
	gaTest("Gyro", brick.gyroscope(), gyroTimer);
});

// Accelerometer
var accelTimer = script.timer(GA_TIMER);
accelTimer.timeout.connect(function () {
	gaTest("Accel", brick.accelerometer(), accelTimer);
});

// USensors
var DSENSOR_TIMER = 1000;
var DSensorRange = 100;
var DSensorBenchmark = 123456;

var d1Counter = 0;
var d1Timer = script.timer(DSENSOR_TIMER);
d1Timer.timeout.connect(function () {
	d1Counter = sensorTest(D1, d1Timer, d1Counter, DSensorBenchmark, DSensorRange, edTests);
});

var d2Counter = 0;
var d2Timer = script.timer(DSENSOR_TIMER);
d2Timer.timeout.connect(function () {
	d2Counter = sensorTest(D2, d2Timer, d2Counter, DSensorBenchmark, DSensorRange, edTests);
});

//AnalogSensor
var ASENSOR_TIMER = 1000;
var ASensorRange = 100;
var ASensorBenchmark = 123456;

var a1Counter = 0;
var a1Timer = script.timer(ASENSOR_TIMER);
a1Timer.timeout.connect(function () {
	a1Counter = sensorTest(A1, a1Timer, a1Counter, ASensorBenchmark, ASensorRange, aTests);
});

var a2Counter = 0;
var a2Timer = script.timer(ASENSOR_TIMER);
a2Timer.timeout.connect(function () {
	a2Counter = sensorTest(A2, a2Timer, a2Counter, ASensorBenchmark, ASensorRange, aTests);
});

var a3Counter = 0;
var a3Timer = script.timer(ASENSOR_TIMER);
a3Timer.timeout.connect(function () {
	a3Counter = sensorTest(A3, a3Timer, a3Counter, ASensorBenchmark, ASensorRange, aTests);
});

var a4Counter = 0;
var a4Timer = script.timer(ASENSOR_TIMER);
a4Timer.timeout.connect(function () {
	a4Counter = sensorTest(A4, a4Timer, a4Counter, ASensorBenchmark, ASensorRange, aTests);
});

var a5Counter = 0;
var a5Timer = script.timer(ASENSOR_TIMER);
a5Timer.timeout.connect(function () {
	a5Counter = sensorTest(A5, a5Timer, a5Counter, ASensorBenchmark, ASensorRange, aTests);
});

var a6Counter = 0;
var a6Timer = script.timer(ASENSOR_TIMER);
a6Timer.timeout.connect(function () {
	a6Counter = sensorTest(A6, a6Timer, a6Counter, ASensorBenchmark, ASensorRange, aTests);
});

brick.keys().buttonPressed.connect(function(b,v) {
	if (b == KeysEnum.Power) { // for trikRun console
		var cursorBackPos = consoleOutput.length + 1;
		print("\033[" + cursorBackPos + "E");
		script.quit(); 
	}
	switch (b) {
		case KeysEnum.Esc:
			buttonTests["Esc"] = successStatusText;
			consoleOutput["Esc"] = "pressed";
			break;
		case KeysEnum.Enter:
			buttonTests["Enter"] = successStatusText;
			consoleOutput["Enter"] = "pressed";
			break;
		case KeysEnum.Down:
			buttonTests["Down"] = successStatusText;
			consoleOutput["Down"] = "pressed";
			break;
		case KeysEnum.Up:
			buttonTests["Up"] = successStatusText;
			consoleOutput["Up"] = "pressed";
			break;
		case KeysEnum.Left:
			buttonTests["Left"] = successStatusText;
			consoleOutput["Left"] = "pressed";
			break;
		case KeysEnum.Right:
			buttonTests["Right"] = successStatusText;
			consoleOutput["Right"] = "pressed";
			break;
		case KeysEnum.Power: 
			var cursorBackPos = consoleOutput.length + 1;
			print("\033[" + cursorBackPos + "E");
			script.quit(); 
		}
});
	
var CAMERA_TIMER = 1000;
var artagValue = 0;
var cameraTimer = script.timer(CAMERA_TIMER);
cameraTimer.timeout.connect(function () {
	
	cameraTimer.stop();
	print("Start");
	artagValue = artagTest();
	//print(artagValue);
	if (artagValue == CAMERA_CHECK_VALUE) {
		cameraTests["Camera"] = successStatusText;
		consoleOutput["Camera"] = artagValue;
	}
	else {
		if (artagValue == -1)
			consoleOutput["Camera"] = "Otsu Failed";
		else 
			consoleOutput["Camera"] = artagValue;
		cameraTimer.start();
	}
});

var CONSOLE_TIMER = 2000;
var consoleOutputTimer = script.timer(CONSOLE_TIMER);
consoleOutputTimer.timeout.connect(function () {
	consoleOutputTimer.stop();
	print("\033[0J")
	var timeToShow = Date.now() - timeStart; 
	print("!!! Past time: " + timeToShow + "ms !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
	for (var key in consoleOutput) {
		print("\033[2K" + key + " " + consoleOutput[key]);
	}
	print("\033[" + consoleOutput.length + "F");
	consoleOutputTimer.start();
});

var REDRAW_TIMER = 500;
var redrawTimer = script.timer(REDRAW_TIMER); 
redrawTimer.stop();

var redrawFunc = function () {
	redrawTimer.stop();
	var wordStartX = 1;
	var wordStartY = 1 * SYMBOL_HEIGHT + 10;// 10 beauty space;
	
	brick.display().setPainterColor("Black");
	printCenter("TRIK Test v1.0", 0);
	printCenter("Power button to exit ", SCREEN_HEIGHT - SYMBOL_HEIGHT * 2);		

	brick.display().addLabel("Special thanks to bschepan ", wordStartX, SCREEN_HEIGHT - SYMBOL_HEIGHT);
	
	printStatus("E1-4,D1-2:", SYMBOL_HEIGHT * 1, edTests);
	printStatus("A1-6: ", SYMBOL_HEIGHT * 2, aTests);
	printStatus("Gyro,Accel:", SYMBOL_HEIGHT * 3, agTests);
	printStatus("Camera: ", SYMBOL_HEIGHT * 4, cameraTests);
	printStatus("🞫 ✔ ▲ ▼ ◀ ▶:", SYMBOL_HEIGHT * 5, buttonTests);
	
	brick.display().redraw();
	redrawTimer.start();
}
redrawTimer.timeout.connect(redrawFunc)
redrawFunc();
script.run();
