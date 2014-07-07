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

To see video, use VLC player, launch it with "vlc http://<robot IP>:5005 :network-caching=100" command, for example, "vlc http://192.168.0.128:5005 :network-caching=100"