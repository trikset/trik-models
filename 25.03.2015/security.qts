script.system("mjpg_streamer -i \"input_uvc.so -d /dev/video2 -r 432x240 -f 30\" -o \"output_http.so -w /www\"");

while (!brick.keys().wasPressed(KeysEnum.Esc)) {
	script.wait(100);
}

script.system("killall mjpg_streamer");
