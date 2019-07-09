var wasActivity = false;
var wasMotion = false;

// "false" parameter in "setPower" is needed to remove dependence from motor linearization 
var r = function(power) {
	brick.motor(M3).setPower(power, false);
	return true;
};

var g = function(power) {
	brick.motor(M2).setPower(power, false);
	return true;
};

var b = function(power) {
	brick.motor(M4).setPower(power, false);
	return true;
};

var d = function(power) { //gnD
	brick.motor(M1).setPower(power, false);
	return true;
}; 

var h = 0;
var s = 1;
var v = 0.5;

var gyro = brick.gyroscope();
var gdata = [0, 0, 0];

var play = brick.playTone;
var isSilent = true;
var freq = 0;
var BASE = 20; 

var radToDeg = 180.0 / Math.PI;

// Controller buttons 

brick.keys().buttonPressed.connect(
	function(code, value) { 
	if (value != 1) return;
	switch (code) {
		case KeysEnum.Up  :
        		isSilent = false;
			break;
		case KeysEnum.Down:
				isSilent = true;
			break;
      	default: break;
    }
  }
);


// Support (color) functions

var sat = function (a) {
	var max = 100;
	return a > max ? max : a;
}

// Convert HSV to RGB. Return array of RGB 
// HSV: H in [0, 360], S in [0, 1], V in [0, 1]
// RGB: R in [0, 100], G in [0, 100], B in [0, 100]
var hsvToRgb = function(h, s, v) {
	var i;
	var f, p, q, t;
	var r, g, b;

	if (s == 0) {
		r = g = b = v;
		return [100 * r, 100 * g, 100 * b];
	}

	h = h / 60;			// sector 0 to 5
	i = Math.floor(h);
	f = h - i;			// factorial part of h
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));

	switch (i) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = v;
			b = p;
			break;
		case 2:
			r = p;
			g = v;
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = v;
			break;
		case 4:
			r = t;
			g = p;
			b = v;
			break;
		default:		// case 5:
			r = v;
			g = p;
			b = q;
			break;
	}
	return [100 * r, 100 * g, 100 * b];
} 


// Gamepad mode

gamepad.disconnected.connect(
	function() {
		brick.playTone(300,1000);
	}
)

gamepad.connected.connect(
	function() {
		brick.playTone(500,1000);
	}
)

var updateHS = function(x, y) {
	// Remove the center of HSV cylinder for bright colors
	if (x * x + y * y < 10000) {
		h = Math.atan2(x, y) * radToDeg;
		s = Math.sqrt(x * x + y * y) / 200 + 0.5;
	}
}

var updateV = function(x, y) {
	// Remove the most black and white sides of HSV cylinder
	v = (y + 100) / 400 + 0.5;
}

gamepad.pad.connect(
	function(padId, x, y) {
		wasActivity = true;
		if (padId == 1) {
			updateHS(x, y);
		} else {
			updateV(x, y);
	}
		var rgb = hsvToRgb(h, s, v);
		r(rgb[0]);
		g(rgb[1]);
		b(rgb[2]);
		d(100);
	}
)

gamepad.padUp.connect(
	function(padId) {
		wasActivity = true;
	}
)


gamepad.button.connect(
	function(buttonId, pressed) {
		wasActivity = true;
	}
)


// Autonomous mode

gyro.newData.connect(
	function(data_, time_) {
		gdata = data_;
	}
)

var waitOrBreak = function(x) {
	for (var i = 0; i < x; i++) {
		if (!wasActivity && !wasMotion) {
			script.wait(1000);		
		} else {
			return false;
		}
	}
	return true;
}

var blinkStart = function() {
		d(100)
		&& r(100)
		&& waitOrBreak(1)
		&& r(0)
		&& g(100)
		&& waitOrBreak(1)
		&& g(0)
		&& b(100)
		&& waitOrBreak(1)
		&& b(0)
		&& d(0);
}

var wewLoop = function() {
	var freq_new = sat((Math.abs(gdata[0]) + Math.abs(gdata[1]) + Math.abs(gdata[2])) >> 9);

	if (freq_new < 40) {
		if (freq && !isSilent) 
			play(20, 5000);
		freq = 0;
	} else if (freq != freq_new) {
  		wasMotion = true;
    	d(100);
    	r(sat(gdata[0] >> 9));
    	g(sat(gdata[1] >> 9));
    	b(sat(gdata[2] >> 9));
    	freq = freq_new;
    	if (!isSilent)
    		play(BASE + freq, 2000);
  } 
  
  if (wasActivity)
		mainT.stop();
}


var updateControlMode = function() {
	controlModeTimer.stop();

	wasActivity = false;
	script.wait(3000);
	if (!wasActivity) {
		mainT.start();
	}

	controlModeTimer.start();
}

var updateMotionMode = function() {
	motionModeTimer.stop();
	if (!wasMotion && !wasActivity) {
		blinkStart();
	}
	wasMotion = false;
	motionModeTimer.start();
}


var controlModeTimer = script.timer(7000);
controlModeTimer.timeout.connect(updateControlMode);
controlModeTimer.start();

var motionModeTimer = script.timer(10000);
motionModeTimer.timeout.connect(updateMotionMode);
motionModeTimer.start();

var mainT = script.timer(100);
mainT.timeout.connect(wewLoop);
mainT.start();

r(100);
g(100);
b(100);
d(100);

script.run();
