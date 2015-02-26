//config vars
var padEps = 10;
var refreshRate = 30;
var stepEps = 10;

//motors
var motorFL = brick.motor("M1");
var motorFR = brick.motor("M2");
var motorBL = brick.motor("M3");
var motorBR = brick.motor("M4");

//helper functions
function eps(val) { return (Math.abs(val) < padEps) ? 0 : val}

function limit100 (val) { return (val < -100) ? -100: ((val > 100) ? 100: val)}

function gradient(desiredValue, lastValue) {
    var tmp = lastValue - desiredValue;
    if (!eps(desiredValue)) return 0;
    return ((-stepEps < tmp) &&
    (tmp < stepEps)) ? desiredValue // small step
        : ((tmp < 0) ? lastValue + stepEps
        : lastValue - stepEps)
}

//pad's values
var currentX = 0;
var currentY = 0;
var currentRot = 0;

//current mecanum's speed
var fl = 0;
var fr = 0;
var bl = 0;
var br = 0;

gamepad.pad.connect(
    function(padId, x, y) {
        if (padId == 1) {
            currentX = x;
            currentY = y;
        }
        else if (padId == 2) {
            currentRot = eps(x);
        }
    }
);

gamepad.padUp.connect(
    function(padId, _, __) {
        if (padId == 1) {
            currentX = 0;
            currentY = 0;
        }
        else if (padId == 2) {
            currentRot = 0;
        }
    }
);

gamepad.disconnect(function() {brick.stop()});

brick.repeat(refreshRate,
    function() {
        var sum1  = limit100(eps((currentY + 3*currentX/2)));
        var diff1 = limit100(eps((currentY - 3*currentX/2)));

        fl = gradient(sum1 + currentRot, fl);
        br = gradient(sum1 - currentRot, br);
        fr = gradient(diff1 - currentRot, fr);
        bl = gradient(diff1 + currentRot, bl);

        motorFL.setPower(fl);
        motorBR.setPower(br);
        motorFR.setPower(fr);
        motorBL.setPower(bl);
    }
);

//Simple smoothness correstion routine
/*
gamepad.button.connect(
    function(buttonId, pressed) {
        if (pressed == 0) {
            return;
        }

        switch (buttonId) {
            case 1: {
                if (refreshRate > 10) {
                    refreshRate -= 10
                }
                break;
            }
            case 2: {
                if (refreshRate < 150) {
                    refreshRate += 10
                }
                break;
            }
            case 3: {
                if (stepEps > 5) {
                    stepEps -= 5
                }
                break;
            }
            case 4: {
                if (stepEps < 50) {
                    stepEps += 5
                }
                break;
            }
            case 5: {
                brick.quit();
            }
        }
        brick.display().removeLabels();
        brick.display().addLabel("Refresh Rate = " + refreshRate,10,10);
        brick.display().addLabel("Acceleration = " + stepEps, 10, 40);

    }
);
*/

script.run();