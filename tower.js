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
var a1 = 0;
var a2 = 0;
var a3 = 0;
var a4 = 0;
var a5 = 0;
var a6 = 0;

var count = 0;

var main = function()
{
	__interpretation_started_timestamp__ = Date.now();

	brick.motor(M1).setPower(100);
	while (true) {
		red = 0;
		green = 0;
		blue = 0;
		red = 0;
		green = 0;
		blue = 0;
		a1 = brick.sensor(A1).read() < 40 ? 1 : 0;
		a2 = brick.sensor(A2).read() < 40 ? 1 : 0;
		a3 = brick.sensor(A3).read() < 40 ? 1 : 0;
		a4 = brick.sensor(A4).read()< 40 ? 1 : 0;
		a5 = brick.sensor(A5).read()< 40 ? 1 : 0;
		a6 = brick.sensor(A6).read()< 40 ? 1 : 0;
		if ( a1 + a2 + a3 + a4 + a5 + a6 == 0) {
			if (count > 200) { count = 100;}
			count++;
			brick.motor(M3).setPower(count - 100); 
			script.wait(100);
			continue;
		}
		count = 0;
		if (a1 ){
			red = red + 60;
		}
		if (a2 ) {
			red = red + 35;
			blue = blue + 10;
		}
		if (a3 ) {
			red = red + 5;
			blue = blue + 40;
		}
		if (a4 ) {
			blue = blue + 40;
			green = green +  5;
		}
		if  (a5 ) {
			green = green + 35;
			blue = blue + 10;
		}
		if  (a6 ) {
			green = green + 60;
		}
		brick.motor(M3).setPower(red); 
		brick.motor(M2).setPower(green);
		brick.motor(M4).setPower(blue);
		script.wait(100);
		brick.motor(M3).setPower(red); 
		brick.motor(M2).setPower(green);
		brick.motor(M4).setPower(blue);
		script.wait(100);
	}
}
