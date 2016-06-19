var stopKey = KeysEnum.Up;
var startKey = KeysEnum.Left;

var left = brick.motor(M3);
var right = brick.motor(M4);

var p = 0.4;
var i = 0.001;
var k = 0.1;

var xys = [0,0,0];
var x = 0;
var s = 0;

var xold = 0;
var speed = 50;

brick.lineSensor("video1").init(true);

var key = 0;
function wasPressed(_key)
{
  key = 0;
  if(brick.keys().wasPressed(_key))
  {
    key = _key;
    return 1;
  }
  else
  {
    return 0;
  }
}

var next = 0;
var terminate = 0;

while(!next) {
  while(!(wasPressed(startKey)||wasPressed(stopKey))) {
    script.wait(100);
  }
  switch(key) {
    case startKey:
      brick.lineSensor("video1").detect();
      next = 1;
      break;
    case stopKey:
      brick.stop();
      next = 1;
      terminate = 1;
      break;
  }
  script.wait(1000);
}

var firstTime = 1;

while(!terminate) {
  if(brick.keys().wasPressed(stopKey)) {
    terminate = 1;
  } else {
    xys = brick.lineSensor("video1").read();
    x = xys[0]
    s = xys[2];
   
    if(s < 12) {
      firstTime = 1;
      if(xold < 0) {
        print("left")
        left.setPower(-80);                      
        right.setPower(0);
      } else {
        print("right");
        left.setPower(0);                      
        right.setPower(-80);
      }
    } else {
      if (firstTime) {
        xold = x;
        firstTime = 0;
      }

      var yaw = x*p + (x - xold)*k + (x+xold)*i;
      print(s, x, yaw);
      left.setPower(-(speed - yaw));
      right.setPower(-(speed + yaw));
      xold = x;
    }
  }
}

brick.lineSensor("video1").stop();
brick.stop();
print("finish");
script.quit();
