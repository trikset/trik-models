/* Copyright 2017 Anastasiya Kornilova
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. */

/* This program calculates the number of expected revolutions per minute for each power motor. 
Before the begining you need to set the CPR (counts per round) parameter for each motor. 
If you want to restart calculations (for example, if you have changed motors) press key "UP". */

var cpr = [64, 64, 64, 64];

// Program starts here

var revs = [0, 0, 0, 0];
var updateKey = KeysEnum.Up;

var keyPressed = function(key) {
	return brick.keys().wasPressed(key);
}

var startAllMotors = function() {
	brick.motor("M1").setPower(100);
	brick.motor("M2").setPower(100);
	brick.motor("M3").setPower(100);
	brick.motor("M4").setPower(100);
}

var pixelPerString = 30;

var updateDisplay = function() {

	var rotationTimeMs = Date.now() - rotationStartTime;

	var display = brick.display();
	var elapsedSec = round(rotationTimeMs / 1000, 1);
	display.addLabel("Elapsed (sec): " + elapsedSec, 10, pixelPerString * 1);
	display.addLabel("Motor / CPR / RPM", 10, pixelPerString * 2);

	for (var i = 1; i <= 4; i++) {
		var infoString = "M" + i + " / " + cpr[i - 1] + " / " + revs[i - 1];
		display.addLabel(infoString, 10, pixelPerString * (i + 2));
		print(elapsedSec + " | " + infoString);
	};

	display.redraw();
}

var updateRevs = function() {
	var rotationTimeMs = Date.now() - rotationStartTime;

	for (var i = 1; i <= 4; i++) {
		var ticks = Math.abs(brick.encoder("E" + i).readRawData());
		var revsPerMin = ((ticks / cpr[i - 1]) * 60000 / rotationTimeMs);
		revs[i - 1] = round(revsPerMin, 1);
	}
}

var resetState = function() {
	for (var i = 1; i <= 4; i++) {
		brick.encoder("E" + i).reset();
	}
	rotationStartTime = Date.now();
}

var round = function(number, accur) {
	return Math.round(number * accur) / accur;
};

var main = function() {

	startAllMotors();
	resetState();	

	var displayTimer = script.timer(500);
	displayTimer.timeout.connect(updateDisplay);
	displayTimer.start();

	var countTimer = script.timer(1000);
	countTimer.timeout.connect(updateRevs);
	countTimer.start();

	brick.keys().buttonPressed.connect(resetState);

	script.run();
}
