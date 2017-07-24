


function Wheel(mName,rName) {
	this.motor = brick.motor(mName);
	this.rotation =  brick.motor(rName);
	
}
Wheel.prototype.move = function(speed) {
	this.motor.setPower(speed);
};
Wheel.prototype.rotate = function(angle){
	this.rotation.setPower(angle);
};
		//todo i don't like it
Wheel.prototype.stop = function(){
	this.motor.powerOff();
	this.rotation.powerOff();
};


function Car(mode){
	this.wheelFL = Wheel("M3","C3");
	brick.display().addLabel("M3 C3",10,10);
	this.wheelFR = Wheel("M4","E1");
	brick.display().addLabel("M4 E1",240-60,10);
	this.wheelBL = Wheel("M2","C2");
	brick.display().addLabel("M2 C2",10,320-40);
	this.wheelBR = Wheel("M1","C1");
	brick.display().addLabel("M1 C1",240-60,320-40);
	this.Modes =  {
					"simple":	{
									init:function(){
										this.stop();
									},
									stop:function() 	{
										this.wheelBR.move(0);
										this.wheelBL.move(0);
										this.wheelFR.move(0);
										this.wheelFL.move(0);
										this.wheelBR.rotate(0);
										this.wheelBL.rotate(0);
										this.wheelFR.rotate(0);
										this.wheelFL.rotate(0);
									},
									drive: function(x,y){},
									rotate:function(x,y){}
				 				},
					"circle":	{
									init:function()		{},
									stop:function() 	{},
									drive: function(x,y){},
									rotate:function(x,y){}
								},
					"lobster":	{
									init:function()		{},
									stop:function() 	{},
									drive: function(x,y){},
									rotate:function(x,y){}
								},
					"tornado":	{
									init:function()		{},
									stop:function() 	{},
									drive: function(x,y){},
									rotate:function(x,y){}
								},
					"parking":	{
									init:function()		{
										this.stop();
									},
									stop:function() 	{
										this.wheelBR.stop();
										this.wheelBL.stop();
										this.wheelFR.stop();
										this.wheelFL.stop();                                                    
									
									},
									drive: function(x,y){},
									rotate:function(x,y){}
								},
	};	
	// angles 			:{	gradusCircle:50, 
	// 					gradus90:100, 
	// 					gradusTornado:75,
	// 				},
	
	
	this.setMode = function(mode){
				if (mode in this.Modes){
					this.currentModeKey = mode;
					this.currentMode = Modes[currentModeKey]
					this.init = currentMode.init;
					this.stop = currentMode.stop;
					this.drive = currentMode.drive;
					this.rotate = currentMode.drive;
					this.init();
				}
	};
	this.setMode(mode);
};

var car = Car("parking");
var gamepad = brick.gamepad();

gamepad.pad.connect(
        function(padId, x, y) {
        	switch(pad) {
        		case 1:
        			car.drive(x,y);
        			break;
        		case 2:
        			car.rotate(x,y);
        			break;
        	}
        }
)
gamepad.padUp.connect(
        function(padId) {
        	switch (padId){
        		case 1:
        			break;
        		case 2:
        			car.stop();
        			break;
        	}
        }
)
gamepad.button.connect(
		function(button, pressed){
			if (pressed == 0){
				return;
			}
			switch(button){
				case 1:
					car.setMode("simple");
					break;
				case 2:
					car.setMode("circle");
					break;
				case 3:
					car.setMode("lobster");
					break;
				case 4:
					car.setMode("tornado");
					break;
				case 5:
					car.setMode("parking");
					break;
			}
		}
)
brick.run();
