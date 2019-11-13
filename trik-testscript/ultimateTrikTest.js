var SYMBOL_WIDTH = 10;
var SYMBOL_HEIGHT = 20;
var SCREEN_WIDTH = 240;
var SCREEN_HEIGHT = 279;
var waitStatusCode = 0;
var errorStatusCode = -1;
var successStatusCode = 1;
var isShowingPhoto = false;
var timeStart = Date.now();

var REDRAW_TIMER = 500;
var CONSOLE_TIMER = 2000;

var CAMERA_TIMER = 1000;
var CAMERA_CHECK_VALUE = 371;

var MOTORS_TIMER = 500;
var MOTORS_START_POWER = 100;
var SERV_START_POWER = 100;

var GA_TIMER = 100;
var GA_CHECK_VALUE = 100;

var ASENSOR_TIMER = 500;
var ASensorRange = 350;
var ASensorBenchmark = 850;

var DSENSOR_TIMER = 1000;
var DSensorRange = 250;
var DSensorBenchmark = 750;

var SENSOR_CHECK_COUNTER = 2; // check every 1 sec, so for 2 checks you need to waitStatusCode at least 3 sec

 
include("/home/root/trik/scripts/artagTest.js");
	
var edTests = {"E1": waitStatusCode, "E2": waitStatusCode, "E3": waitStatusCode, "E4": waitStatusCode, 
	"D1": waitStatusCode, "D2": waitStatusCode};

var aTests = {"A1": waitStatusCode, "A2": waitStatusCode, "A3": waitStatusCode, "A4": waitStatusCode, 
	"A5": waitStatusCode, "A6": waitStatusCode};

var agTests = {"Gyro": waitStatusCode, "Accel": waitStatusCode};

//🞫 ✔ ▲ ▼ ◀ ▶
var buttonTests = {"Esc": waitStatusCode, "Enter": waitStatusCode, "Up": waitStatusCode, "Down": waitStatusCode, 
	"Left": waitStatusCode, "Right": waitStatusCode};

var cameraTests = {"Camera": waitStatusCode};

var consoleOutput = {"E1": waitStatusCode, "E2": waitStatusCode, "E3": waitStatusCode, "E4": waitStatusCode,
	"Gyro": waitStatusCode, "Accel": waitStatusCode, "D1": waitStatusCode, "D2": waitStatusCode, "A1": waitStatusCode,
	"A2": waitStatusCode, "A3": waitStatusCode, "A4": waitStatusCode, "A5": waitStatusCode, "A6": waitStatusCode,
	"Camera": waitStatusCode, "Esc": waitStatusCode, "Enter": waitStatusCode, "Up": waitStatusCode,
	"Down": waitStatusCode, "Left": waitStatusCode, "Right": waitStatusCode};

var printCenter = function (text, y) {
	brick.display().addLabel(text, (SCREEN_WIDTH - text.length * SYMBOL_WIDTH) / 2, y);
}

var printStatus = function (text, y, status) {
	brick.display().setPainterColor("Black");
	brick.display().addLabel(text, 1, y);
	var i = 0;
	for (var key in status) {
		if (status[key] == successStatusCode) {
			brick.display().setPainterColor("Green");
		}
		else {
			brick.display().setPainterColor("Red");
		}
		
		brick.display().drawRect(text.length * SYMBOL_WIDTH + (i * (SYMBOL_WIDTH + 5)), y, SYMBOL_WIDTH, SYMBOL_HEIGHT - 2, true);
		i++;
	}


}

function encoderTest(motor, encoder, previousValue) {
	var currentValue = brick.encoder(encoder).read();
	consoleOutput[encoder] = currentValue;
	brick.encoder(encoder).reset();
	
	brick.motor(motor).setPower(-1 * brick.motor(motor).power());
	
	if (previousValue * currentValue < 0) {
		edTests[encoder] = successStatusCode;
		brick.motor(motor).powerOff();
	}
	else {
		if (previousValue != 0 && currentValue != 0) {
			edTests[encoder] = errorStatusCode;
		}
	}
	return currentValue;
}

function sensorTest(sensor, counter, benchmark, range, tests) {
	var currentValue = brick.sensor(sensor).readRawData();
	var tmp = (currentValue - benchmark) * (currentValue - benchmark);
	consoleOutput[sensor] = currentValue;
	if (tmp < range * range) {
		counter++;
		if (counter >= SENSOR_CHECK_COUNTER) {
			tests[sensor] = successStatusCode;
			return 0;
		}
	} 
	return counter;
}

function gaTest(sensorName, sensor, timer) {
	timer.stop();
	var value = sensor.read();
	var A = value[0] > GA_CHECK_VALUE || value[0] < (-1) * GA_CHECK_VALUE;
	var B = value[0] > GA_CHECK_VALUE || value[0] < (-1) * GA_CHECK_VALUE;
	var C = value[0] > GA_CHECK_VALUE || value[0] < (-1) * GA_CHECK_VALUE;
	consoleOutput[sensorName] = "" + value[0] + " " + value[1] + " " + value[2];
	
	if (!(A || B || C))
		agTests[sensorName] = successStatusCode;
	else 
		timer.start();	
}

__interpretation_started_timestamp__ = Date.now();

brick.display().clear();
brick.display().redraw();

for (var i = 1; i <= 6; i++) {
	brick.motor('S' + i).setPower(MOTORS_START_POWER);
}

for (var i = 1; i <= 4; i++) {
	brick.motor('M' + i).setPower(SERV_START_POWER);
}

///Motors encoders
var prevEncodersValues = [0,0,0,0];
var encoderTimer = script.timer(MOTORS_TIMER);
encoderTimer.timeout.connect(function () {
	encoderTimer.stop();
	var isFinished = true;
	for (var i = 1; i < prevEncodersValues.length; i++) {
		var ePort = "E" + i;
		var mPort = "M" + i;
		if (edTests[ePort] != successStatusCode) {
			isFinished = false;
			prevEncodersValues[i - 1] = encoderTest(mPort, ePort, prevEncodersValues[i - 1]);
		}
	}
	
	if (!isFinished)
		distanceTimer.start();
});

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
var distanceCounter = [0,0];
var distanceTimer = script.timer(DSENSOR_TIMER);
distanceTimer.timeout.connect(function () {
	distanceTimer.stop();
	var isFinished = true;
	for (var i = 1; i <= distanceCounter.length; i++) {
		var dPort = "D" + i;

		if (edTests[dPort] != successStatusCode) {
			isFinished = false;
			distanceCounter[i - 1] = sensorTest(dPort, distanceCounter[i - 1], DSensorBenchmark, DSensorRange, edTests);
		}
	}
	
	if (!isFinished)
		distanceTimer.start();
});

//AnalogSensor
var analogCounter = [0,0,0,0,0,0];
var analogTimer = script.timer(ASENSOR_TIMER);
analogTimer.timeout.connect(function () {
	analogTimer.stop();
	var isFinished = true;
	for (var i = 1; i < analogCounter.length; i++) {
		var sPort = "S" + i;
		var aPort = "A" + i;

		if (aTest[aPort] != successStatusCode) {
			isFinished = false;
			brick.motor(sPort).setPower(-1 * brick.motor(sPort).power());
			analogCounter[i - 1] = sensorTest(aPort, analogCounter[i - 1], ASensorBenchmark, ASensorRange, aTests);
		}
	}
	
	if (!isFinished)
		analogTimer.start();
});

// Buttons
brick.keys().buttonPressed.connect(function(b) {
	if (b == KeysEnum.Power) { // for trikRun console
		var cursorBackPos = consoleOutput.length + 1;
		print("\033[" + cursorBackPos + "E");
		script.quit(); 
	}
	buttonNames = {KeysEnum.Esc: "Esc", KeysEnum.Enter: "Enter", KeysEnum.Up: "Up", KeysEnum.Down: "Down", KeysEnum.Left: "Left", KeysEnum.Right: "Right"};
	buttonTests[buttonNames[b]] = successStatusCode;
	consoleOutput[buttonNames[b]] = "pressed";
	
	if (b == KeysEnum.Esc && isShowingPhoto) {
		brick.display().clear();
		isShowingPhoto = false
	}
	if (b == KeysEnum.Enter && isArtagGoing()) {
		brick.display().clear();
		isShowingPhoto = true;
	}
});


// Camera
var artagValue = 0;
var cameraOutput;
var cameraTimer = script.timer(CAMERA_TIMER);
cameraTimer.timeout.connect(function () {

	cameraTimer.stop();
	print("Start");
	response = artagTest();
	artagValue = response[0];
	cameraOutput = response[1]
	//print(artagValue);
	if (artagValue == CAMERA_CHECK_VALUE) {
		cameraTests["Camera"] = successStatusCode;
		consoleOutput["Camera"] = artagValue;
		isShowingPhoto = false;
	}
	else {
		if (artagValue == -1)
			consoleOutput["Camera"] = "Otsu Failed";
		else 
			consoleOutput["Camera"] = artagValue;
		cameraTimer.start();
	}
});

function isArtagGoing() {
	return artagValue != CAMERA_CHECK_VALUE && artagValue != 0
}

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

var redrawTimer = script.timer(REDRAW_TIMER); 
redrawTimer.stop();

var redrawFunc = function () {
	redrawTimer.stop();
	var wordStartX = 1;
	
	brick.display().setPainterColor("Black");
	if (!isShowingPhoto) {
		printCenter("TRIK Test script", 0);
		printCenter("Power button to exit ", SCREEN_HEIGHT - SYMBOL_HEIGHT * 2);		

		brick.display().addLabel("Special thanks to bschepan ", wordStartX, SCREEN_HEIGHT - SYMBOL_HEIGHT);
		
		printStatus("E1-4,D1-2:", SYMBOL_HEIGHT * 1, edTests);
		printStatus("A1-6: ", SYMBOL_HEIGHT * 2, aTests);
		printStatus("Gyro,Accel:", SYMBOL_HEIGHT * 3, agTests);
		printStatus("Camera: ", SYMBOL_HEIGHT * 4, cameraTests);
		printStatus("🞫 ✔ ▲ ▼ ◀ ▶:", SYMBOL_HEIGHT * 5, buttonTests);
		brick.display().setPainterColor("Black");

		if (isArtagGoing) {
			brick.display().addLabel("ENTER to see camera output", wordStartX, SCREEN_HEIGHT - SYMBOL_HEIGHT * 4);
		}
	}
	else {
		brick.display().show(cameraOutput, 160, 120, "rgb32");
		brick.display().addLabel("ESC to main page", wordStartX, SCREEN_HEIGHT - SYMBOL_HEIGHT * 4);
	}
	
	
	brick.display().redraw();
	redrawTimer.start();
}

redrawTimer.timeout.connect(redrawFunc)
redrawFunc();
script.run();
