//tiny playTone syntax example
var r = brick.motor(M1).setPower;
var g = brick.motor(M2).setPower;
var b = brick.motor(M3).setPower;
var d = brick.motor(M4).setPower;

var gyr = brick.gyroscope();
var play = brick.playTone;

brick.keys().buttonPressed.connect(
  function(code, value) {
    var freq = 0;
    if(!value) return;

    switch(code) {
      case KeysEnum.Up  : freq = 20; break;
      case KeysEnum.Left: freq = 30; break;
      case KeysEnum.Down: freq = 40; break;
      default: freq = 0;
    }
    print(freq);
    if(freq)
      brick.playTone(freq, 2000);
  }
);

var freq = 0;
var BASE = 50; 
var gdata = [0,0,0];
gyr.newData.connect(
  function(data_, time_) {
    gdata = data_;
  }
)


var wewLoop = function() {
  var freq_new = (Math.abs(gdata[0]) + Math.abs(gdata[1]) + Math.abs(gdata[2])) >> 10;
  freq_new *= 5;
  print(freq_new);

  if(freq_new <= 20) {
    if(freq)
      brick.playTone(20, 10);
    freq = 0;
  }
  else if(freq != freq_new) {
    freq = freq_new;
    brick.playTone(BASE+freq, 2000);
  }
}

var main = function() {
  script.system("echo 0 > /sys/class/misc/l3g42xxd/odr_selection");
  var mainT = script.timer(10);
  mainT.timeout.connect(wewLoop);echo 3 > /sys/class/misc/mma845x/odr_selection
  mainT.stop();
  mainT.start();
  script.run();
}
