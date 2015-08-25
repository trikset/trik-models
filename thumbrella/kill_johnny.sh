#!/bin/sh

my_rover_pid=`cat /var/tmp/my_rover_pid`
my_novideo_pid=`cat /var/tmp/my_novideo_pid`
my_vlc_pid=`cat /var/tmp/my_vlc_pid`

killall mjpg_streamer
sleep 1
kill "$my_rover_pid"
kill "$my_novideo_pid"
kill "$my_vlc_pid"

wait "$my_rover_pid"
wait "$my_novideo_pid"
wait "$my_vlc_pid"

echo -n -1 > /var/tmp/my_rover_pid
echo -n -1 > /var/tmp/my_novideo_pid
echo -n -1 > /var/tmp/my_vlc_pid

sleep 1
