var __interpretation_started_timestamp__;
var pi = 3.141592653589793;

/*

  # the sensor value description

  # 0  ~300     dry soil

  # 300~700     humid soil

  # 700~950     in water
*/

var n = 500;

var web = {};

web.sensorSoil = 0;

web.cel = 0;

web.lig = 0;

web.turn = false; //lamp on\off

web.volt = 0;

var tem = brick.sensor(A6).readRawData;
var soil = brick.sensor(A5).readRawData;

var light = brick.sensor(A4).readRawData; 

var voltage = brick.battery().readVoltage;



var servoSoil = brick.motor(S2).setPower;

var servoRoof = brick.motor(S1).setPower;



var motorPomp = brick.motor(M1).setPower;

var lamp = brick.motor(M3).setPower;



function waterPomp(){

	if(web.sensorSoil < 300){

		motorPomp(100);

		script.wait(5000);

		motorPomp(0);

	}

}



function readSoil(){

	servoSoil(40);

	script.wait(1000);

	var sumSoil = 0;

	for(var i = 0; i < n; i++){

		sumSoil += soil();

		script.wait(1);

	}

	web.sensorSoil = Math.floor(sumSoil/ n);

	servoSoil(0);

	script.wait(1000);

	waterPomp();

}



function lampOn(){

	lamp(100);

	web.turn = true;

}



function lampOff(){

	lamp(0);

	web.turn = false;

}



function readLight(){

	//print(light());

	web.lig = light();

	if(web.lig > 400)

		lampOn();

	else

		lampOff();

}



function readTem(){

	var val = tem() * 500 / 1024;

	web.cel = Math.floor(val);

	//print(cel);

}



function printData(){

	print(web.sensorSoil + ";" + web.lig + ";" + web.cel + ";" + web.turn + ";" + web.volt);

}



function readVoltage(){

	web.volt = Math.floor(voltage() * 10) / 10;

	if (web.volt < 11.1){

		print("voltage low.. script quit");

		script.quit();

	}

}

var tSoil = script.timer(60000);

tSoil.timeout.connect(readSoil);

tSoil.start();



var tLight = script.timer(5000);

tLight.timeout.connect(readLight);

tLight.start();



var tTem = script.timer(500);

tTem.timeout.connect(readTem);

tTem.start();



var tPrint = script.timer(500);

tPrint.timeout.connect(printData);

tPrint.start();



var tVoltage = script.timer(500);

tVoltage.timeout.connect(readVoltage);

tVoltage.start();



script.run();

