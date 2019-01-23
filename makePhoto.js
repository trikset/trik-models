startTime = Date.now()
var photo=brick.getStillImage();
print("Finished photo in " + (Date.now()-startTime));
var h = 240;
var w = 320;
var photoBW = [];

var grayscale = "WMXZmOwxzo. "
if (photo.length >= h*w)
for(var i = 0; i < (h>>2); i++) {
        var str = "";
        for(var j = 0; j < (w>>2); j++) {
                var x = j+i*w>>2;
                var p = photo[x*12];
                photoBW[x]=p;
                p = Math.floor(p*grayscale.length>>8);
                str+=grayscale[p]
        }
        print(str)
}
print(photoBW.length)

