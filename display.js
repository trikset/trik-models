var __interpretation_started_timestamp__;
var pi = 3.141592653589793;
var colors = [
"green",
"lightGreen",
"darkGreen",
"blue",
"lightBlue",
"darkBlue",
"cyan",
"lightCyan",
"darkCyan",
"magenta",
"lightMagenta",
"darkMagenta",
"yellow",
"lightYellow",
"darkYellow",
"red",
"lightRed",
"darkRed",
]

var main = function()
{
        __interpretation_started_timestamp__ = Date.now();
        var disp = brick.display();
        var n = 0;
	var perRow = 3;
	var h = 30;
	var w = 200 / perRow;
        for(var n =0; n < colors.length; ++n) {
                disp.setPainterColor(colors[n]);
                c = Math.floor(n / perRow);
                r = n - c * perRow;
                disp.drawRect(r*w, c*h, w,h, true);
		disp.setPainterColor("black")
                disp.addLabel(colors[n],r*w+10,c*h+5);

        }
        brick.display().redraw();
        script.wait(50000);
	brick.smile()
        brick.display().redraw();
	script.wait(20000);
        return;
}

