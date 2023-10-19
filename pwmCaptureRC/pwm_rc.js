var main = function()
{
		brick.display().addLabel("S1 value:", 10, 10);
		brick.display().addLabel("S2 value:", 10, 30);
		brick.display().addLabel("S3 value:", 10, 50);
	
		prev_power = 0;
        while (!brick.keys().wasPressed(KeysEnum.Esc)) {
			s1 = brick.pwmCapture("S1").duty(); // [0,1]
			s2 = brick.pwmCapture("S2").duty(); // [-100,100]
			s3 = brick.pwmCapture("S3").duty(); // [-50,50]

            motor_power = s2 <= 10 ? (s2 >= -10 ? 0 : s2) : s2;
            angle_power = s3 <= 10 ? (s3 >= -10 ? 0 : s3) : s3;
            motor_power = !s1 ? motor_power : -motor_power;
            if (Math.abs(prev_power - motor_power) > 50) {
				brick.motor(M3).brake(); 
				brick.motor(M4).brake(); 
			} else {
                brick.motor("M3").setPower(motor_power + angle_power); // left
                brick.motor("M4").setPower(motor_power - angle_power); // right
            }
            prev_power = motor_power;
            brick.display().addLabel(s1, 100, 10);
            brick.display().addLabel(s2, 100, 30);
            brick.display().addLabel(s3, 100, 50);
            brick.display().redraw();

            script.wait(100);
        }

        return;
}
