//motors
var M1 = brick.motor(M1);
var M2 = brick.motor(M2);
var M3 = brick.motor(M3);
var M4 = brick.motor(M4);

//led
var r = brick.motor(S3);
var g = brick.motor(S2);
var b = brick.motor(S1);

//sensors
var A12 = brick.sensor(A6); // m1-m2 side
var A24 = brick.sensor(A5); // m2-m4 side
var A43 = brick.sensor(A4); // m4-m3 side
var A31 = brick.sensor(A3); // m3-m1 side
var colorSensor = brick.colorSensor("video2");

var d_lim=20;
var s = 100;

//speeds
var Ms12 = [0,0,0,0];
var Ms24 = [0,0,0,0];
var Ms43 = [0,0,0,0];
var Ms31 = [0,0,0,0];
var M = [Ms12, Ms24, Ms43, Ms31];

var Ss12 = [ s, s, s, s];
var Ss24 = [ s,-s,-s, s];
var Ss43 = [-s,-s,-s,-s];
var Ss31 = [-s, s, s,-s];
var S = [Ss12, Ss24, Ss43, Ss31];

function m_setPower_(M_, S_) {
  M_[0] = S_[0];
  M_[1] = S_[1];
  M_[2] = S_[2];
  M_[3] = S_[3];
}

function m_powerOff_(M_) {
  M_[0] = 0;
  M_[1] = 0;
  M_[2] = 0;
  M_[3] = 0;
}

function m_setPower(a_, M_, S_) {
  if(a_ > d_lim) {
    m_setPower_(M_, S_);
  } else {
    m_powerOff_(M_)
  }
}

function m_powerOff() {
  m_powerOff_(M[0]);
  m_powerOff_(M[1]);
  m_powerOff_(M[2]);
  m_powerOff_(M[3]);
}

var paused = 0;
var f = true;
var moveLoop = function() {
  if(paused > 0) {
    M1.setPower(0);
    M2.setPower(0);
    M3.setPower(0);
    M4.setPower(0);
  } else {
    var a = [A12.read(), A24.read(), A43.read(), A31.read()];

    if(a[0] < d_lim && a[1] <= d_lim && a[2] <= d_lim && a[3] <= d_lim) {
      //print("safe");
      if(f) {
        //print("Set random direction");
        var dir1 = Math.floor(Math.random()*4);
        var dir2 = (dir1+Math.floor(Math.random()*2))%4;

        m_powerOff();
        m_setPower_(M[dir1], S[dir1]);
        m_setPower_(M[dir2], S[dir2]);
        //print(dir1, M[dir1]);
        //print(dir2, M[dir2]);
        f = false;
      }
    } else {
      //print("not safe");
      for(var i = 0; i < 4; i+=1) {
        m_setPower(a[i], M[i], S[i]);
      }
      f = true;
    }

    //print(M);
    M1.setPower(M[0][0]+M[1][0]+M[2][0]+M[3][0]);
    M2.setPower(M[0][1]+M[1][1]+M[2][1]+M[3][1]);
    M3.setPower(M[0][2]+M[1][2]+M[2][2]+M[3][2]);
    M4.setPower(M[0][3]+M[1][3]+M[2][3]+M[3][3]);
  }
}

var colorLoop = function() {
  if(paused > 1) {
    r.setPower(0);
    g.setPower(0);
    b.setPower(0);
  } else {
    var rgb = colorSensor.read(1, 1);
    print(rgb);
    if(rgb[2] > rgb[1] && rgb[2] > rgb[0]) {
      r.setPower(0);
      g.setPower(0);
      b.setPower(100);
    } else if(rgb[1] > rgb[0] && rgb[1] > rgb[2]) {
      r.setPower(0);
      g.setPower(100);
      b.setPower(0);
    } else {
      r.setPower(70);
      g.setPower(30);
      b.setPower(0);
    }
  }
}

brick.keys().buttonPressed.connect(
  function(code, value) {
    if (code == KeysEnum.Up && value == 1) { 
      paused=(paused+1)%3;
      print(paused);
    } 
  }
);


colorSensor.init(true);
script.wait(1);
script.system("echo \"mxn 1 1\" > /run/mxn-sensor.in.fifo");

var moveT = script.timer(50);
moveT.timeout.connect(moveLoop);
moveT.stop();
moveT.start();

var colorT = script.timer(500);
colorT.timeout.connect(colorLoop);
colorT.stop();
colorT.start();

script.run();

