/* Copyright 2024 Vladimir Kutuev
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *                 http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. */

/*
 * This program illustrate work with IR (infrared) camera MLX90640.
 * There are two modes.
 * 1. Camera mode. Display image from IR camera colored with plasma color map.
 * 2. Sensor mode. Display 3x3 ir sensor grid.
 *
 * Press ✔ to switch between modes.
 * Press 🞫 to exit.
 */

/*
 * Temperature sensor value descriptions: colors and labels.
 */
var temprs = [
{ color: "darkBlue", label: "Freezing" },
{ color: "blue", label: "Cold" },
{ color: "darkMagenta", label: "Cool" },
{ color: "darkRed", label: "Lukewarm" },
{ color: "red", label: "Warm" },
{ color: "yellow", label: "Hot" },
{ color: "white", label: "Boiling" },
]

var main = function() {
        /*
        * mode = 0 — cemra moode (display image from IR camera)
        * mode = 1 — sensor mode (display IR sensor grid)
        */
        var mode = 0;

        /*
         * Sensor grid rectangles width and height
         */
        var w = 240 / 3;
        var h = 75;

        var irCam = brick.irCamera();
        var disp = brick.display();

        /*
         * Initialize IR camera and start capturing.
         */
        irCam.init();

        while (!brick.keys().wasPressed(KeysEnum.Esc)) {
                if (mode == 0) {
                        /*
                         * Display IR image in pseudo plasma color map.
                         */
                        var img = irCam.getImage();
                        disp.show(img, 32, 24, "rgb32");
                } else {
                        /*
                         * Display sensor grid.
                         */
                        for (var i = 1; i <= 3; i++) {
                                for (var j = 1; j <= 3; ++j) {
                                        var tempr = irCam.readSensor(i, j);
                                        disp.setPainterColor(temprs[tempr].color);
                                        disp.drawRect((j - 1) * w, (i - 1) * h, w, h, true);
                                        disp.setPainterColor("black");
                                        disp.addLabel(temprs[tempr].label,(j - 1) * w, (i - 1) * h + 40);
                                }
                        }
                }

                /*
                 * Display help.
                 */
                disp.setPainterColor("white");
                disp.drawRect(0, 230, 240, 240, true);
                disp.setPainterColor("black");
                disp.addLabel("x — Exit  v — Change mode", 10, 235);
                disp.redraw();

                /*
                 * Change mode if Enter pressed.
                 */
                if (brick.keys().wasPressed(KeysEnum.Enter)) {
                        mode = 1 - mode;
                        disp.clear();
                }
        }
        brick.stop();

        return;
}
