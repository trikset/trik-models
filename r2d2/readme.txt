R2D2 remote video surveillance robot.

Consists of 2 power motors, 2 angular servos and USB webcam. Steered from android gamepad. Assembly instruction to be done.
To connect:
- install "TRIK gamepad" application from Google Play (this instruction uses version 1.4)
- launch it
- go to settings (button in a left bottom corner)
- in "Robot IP address" field enter robot IP
- in "Robot TCP port" field enter 4444

Now left pad will control camera direction, right pad will control power motors. 
Button 1 will show smile on a screen, button 2 will show sad smile, button 3 will order robot to say "Hello, I am TRIK".

To see video, open http://<Robot IP address>:8080/stream_simple.html in your favorite browser, for example http://192.168.1.1:8080/stream_simple.html.

For best results configure robot as WiFi access point.

Compatibility:
- requires system image "testing/2014.07.10/" or newer
- requires trikRuntime-3.0.0-a7-1

Known issues:
- Script does not kill video capture process, so video will be streamed even afrer script is stopped.
- Sometimes video device becomes locked for no apparent reason and streaming does not launch at all. Reboot helps.