""" Copyright 2021 CyberTech Labs Ltd.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License. """

import math

w = 240
h = 280
scale = 0.5

waitTimer = 500
moveControl = 0
tickPerSecond = 1000 // waitTimer
while not brick.keys().wasPressed(KeysEnum.Up):
    moveControl = (moveControl + 1) % (10 * tickPerSecond)
    power = 100
    if math.sin(moveControl / tickPerSecond) < 0:
        power = -100

    brick.motor('M3').setPower(power)
    brick.motor('M4').setPower(power)

    pic = [0x008800] * (h * w)

    for j in range(w // 2, w):
        pic[h // 2 * w + j] = 0x888888

    data = brick.lidar().read()
    for i in range(360):
        distance = data[i]
        if distance == 0:
            continue
        theta = i * math.pi / 180
        x = distance * math.cos(theta)
        y = distance * math.sin(theta)
        x_px = min(w - 1, max(0, math.floor(x * scale + w / 2)))
        y_px = min(h - 1, max(0, math.floor(y * scale + h / 2)))
        pic[y_px * w + x_px] = 0

    brick.display().show(pic, w, h, 'rgb32')
    script.wait(waitTimer)

brick.stop()
