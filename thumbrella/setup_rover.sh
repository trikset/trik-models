#!/bin/sh       
echo 0 > /sys/class/gpio/gpio62/value
sleep 1
echo 1 > /sys/class/gpio/gpio62/value

i2cset -y 2 0x48 0x10 0x1770 w
i2cset -y 2 0x48 0x11 0x1770 w
i2cset -y 2 0x48 0x12 0x1770 w
i2cset -y 2 0x48 0x13 0x1770 w
i2cset -y 2 0x48 0x14 0x0
i2cset -y 2 0x48 0x15 0x0
i2cset -y 2 0x48 0x16 0x0
i2cset -y 2 0x48 0x17 0x0
echo '1' > /sys/devices/platform/ecap.0/pwm/ecap.0/request
echo '1' > /sys/devices/platform/ecap.1/pwm/ecap.1/request
echo '1' > /sys/devices/platform/ehrpwm.1/pwm/ehrpwm.1:1/request
echo '1' > /sys/devices/platform/ecap.0/pwm/ecap.0/run
echo '1' > /sys/devices/platform/ecap.1/pwm/ecap.1/run
echo '1' > /sys/devices/platform/ehrpwm.1/pwm/ehrpwm.1:1/run
echo '50' > /sys/devices/platform/ecap.0/pwm/ecap.0/period_freq
echo '50' > /sys/devices/platform/ecap.1/pwm/ecap.1/period_freq
echo '50' > /sys/devices/platform/ehrpwm.1/pwm/ehrpwm.1:1/period_freq
 
echo 1 > /sys/class/gpio/gpio62/value

echo -n -1 > /var/tmp/my_rover_pid
echo -n -1 > /var/tmp/my_novideo_pid
echo -n -1 > /var/tmp/my_vlc_pid
