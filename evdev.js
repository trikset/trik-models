// ls /dev/input/by-path/
// evtest <path-to-evdev-file>
// TODO: use constants for axes and codes from system.js https://github.com/trikset/trikRuntime/blob/master/trikScriptRunner/system.js#L25

var ed = brick.eventDevice("/dev/input/by-path/platform-musb-hdrc-usb-0:1:1.0-event-joystick");
ed.on.connect(function (e,c,v,t) {
if (e == 1) { // this is a button
   if (v == 1) { // some button was pressed
     if (c == 307) { 
        
     } else if (c == 305) {
     } // ... and so on
     else { 
      print("Unknown button: " + c);
     }
   }
} else if (e == 3) { // this is a stick
   
print (c + ", " + v) // print axes code and value
} 

});
script.run()
script.wait(5000)
script.quit();
