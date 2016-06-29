/*
 * Apache License
 * Version 2.0, January 2004
 * http://www.apache.org/licenses/
 *
 * Lightsaber
*/

var r = brick.motor(M3).setPower;
var g = brick.motor(M1).setPower;
var b = brick.motor(M4).setPower;
var d = brick.motor(M2).setPower; //gnD

var gyr = brick.gyroscope();
var play = brick.playTone;

//color flags
var rf = false;
var gf = false;
var bf = false;

brick.keys().buttonPressed.connect(
  function(code, value) { //saber color sets here
    if(value != 1) return;
    switch(code) {
      case KeysEnum.Up  :
        var rout = rf ? 100 : -100;
        rf = !rf;
        r(rout);
        break;
      case KeysEnum.Left:
        var gout = gf ? 100 : -100;
        gf = !gf;
        g(gout);
        break;
      case KeysEnum.Down:
        var bout = bf ? 100 : -100;
        bf = !bf;
        b(bout);
      break;
      default: break;
    }
  }
);

var freq = 0;
var BASE = 20; 
var gdata = [0,0,0];
gyr.newData.connect(
  function(data_, time_) {
    gdata = data_;
  }
)

var sat = function (a) {
  var max = 70
  if (a > max)
    return max;
  else
    return a;
}

var wewLoop = function() {
  var freq_new = sat((Math.abs(gdata[0]) + Math.abs(gdata[1]) + Math.abs(gdata[2])) >> 9);
  print(freq_new);

  if(freq_new < 20) {
    if(freq)
      play(20, 10);
    freq = 0;
  }
  else if(freq != freq_new) {
    freq = freq_new;
    brick.playTone(BASE+freq, 2000);
  }
}

var main = function() {
  d(-100); //wisely the pin you should choose
  
  r(100);
  g(-100);
  b(100);
  script.system("echo 0 > /sys/class/misc/l3g42xxd/odr_selection");
  
  var mainT = script.timer(100);
  mainT.timeout.connect(wewLoop);
  mainT.stop();
  mainT.start();
  script.run();
}
