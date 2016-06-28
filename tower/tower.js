/*Copyright 2016 Kseniya Gonta

* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at

* http://www.apache.org/licenses/LICENSE-2.0

* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var __interpretation_started_timestamp__;
var pi = 3.1415926535897931;
var red = 0;
var green = 0;
var blue = 0;
var vector = [0, 0, 0];
var hasPositive = 0;
var addCoef = {A1: [60, 0, 0], A2:[35, 10, 0], A3: [5, 40, 0], A4: [0, 40, 5], A5: [0, 10, 35], A6: [0, 0, 60]};
var count = 0;

var main = function()
{
	__interpretation_started_timestamp__ = Date.now();

	brick.motor(M1).setPower(100);
	while (true) {
		red = 0;
		green = 0;
		blue = 0;
		vector = [0, 0, 0];
		for (var sensorNum in addCoef) {
			if (brick.sensor(sensorNum).read() < 40) {
				vector = addCoef[sensorNum];
				red += vector[0];
				green += vector[1];
				blue += vector[2];
			}
		}
		
		if (!(red + green + blue)) {
			if (count > 200) { count = 100;}
			count++;
			brick.motor(M3).setPower(count - 100); 
			script.wait(100);
			continue;
		}
		
		brick.motor(M3).setPower(red); 
		brick.motor(M2).setPower(green);
		brick.motor(M4).setPower(blue);
		script.wait(100);
	}
}
