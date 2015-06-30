#!/bin/sh


  run () {
    cd /home/root/rover-demo
    v4l2-ctl -d /dev/video2 --set-ctrl power_line_frequency=1
    v4l2-ctl -d /dev/video2 --set-ctrl white_balance_temperature_auto=0
    v4l2-ctl -d /dev/video2 --set-ctrl white_balance_temperature=4000

    ./v4l2-dsp-fb.xv5T --v4l2-path=/dev/video2 & my_rover_pid=$!
    renice -19 $my_rover_pid
    echo -n $my_rover_pid > /var/tmp/my_rover_pid
  }

cd /home/root

./kill_johnny.sh
./setup_rover.sh
run
