/* Copyright 2016 CyberTech Labs Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This file was modified by Yurii Litvinov to make it comply with the requirements of trikRuntime
 * project. See git revision history for detailed changes. */

#include <QtGui/QApplication>
#include <trikControl/brickFactory.h>
#include <trikControl/brickInterface.h>

#include <QtCore/QTimer>

#include "accelerometerListener.h"

int main(int argc, char *argv[])
{
	QApplication a(argc, argv);

	trikControl::BrickInterface *brick = trikControl::BrickFactory::create(".", ".");

	AccelerometerListener listener(*brick->accelerometer()
			, *brick->motor("M1")
			, *brick->motor("M2")
			, *brick->display()
			);

	QTimer timer;
	timer.setInterval(100);

	QObject::connect(&timer, SIGNAL(timeout()), &listener, SLOT(onTimeout()));

	brick->motor("M4")->setPower(100);

	timer.start();

	return a.exec();
}
