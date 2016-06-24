var left  = brick.motor("M1");
var right = brick.motor("M2");
var rule  = brick.motor("E1");

gamepad.pad.connect(
  function(padId, x, y) {
    if (padId == 1) {
      print("rule",x);
      rule.setPower(x);
    }

    if (padId == 2) {
      print("lr",y);
      left.setPower(y);
      right.setPower(y);
    }
  }
)

gamepad.padUp.connect(
  function(padId, x, y) {
    if (padId == 1) {
      timer.start();
    } else if (padId == 2) {
      left.powerOff();
      right.powerOff();
    }
  }
)

function m_loop() {
  print("stop rule");
  rule.powerOff();
  timer.stop();
}

print("start");
var timer = script.timer(5000);
timer.timeout.connect(m_loop);
timer.stop();

script.run();
