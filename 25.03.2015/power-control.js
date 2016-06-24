brick.motor(M1).setPower(100);
brick.motor(M2).setPower(100);
brick.motor(M3).setPower(100);
brick.motor(M4).setPower(100);

while (!gamepad.buttonWasPressed(1)) {
	script.wait(10);
}

brick.motor(M1).powerOff();
brick.motor(M2).powerOff();
brick.motor(M3).powerOff();
brick.motor(M4).powerOff();