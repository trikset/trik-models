/* Copyright 2014 CyberTech Labs Ltd.
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
 * limitations under the License. */

#include <QtCore/QCoreApplication>
#include <QtCore/QTimer>

#include <trikControl/brick.h>

#include "gyroscope.h"

int main(int argc, char* argv[])
{
	QCoreApplication app(argc, argv);
	trikControl::Brick brick(*QCoreApplication::instance()->thread(), ".", ".");

	cppExample::Gyroscope gyroscope(brick);
	QTimer timer;
	timer.setInterval(100);
	timer.setSingleShot(false);

	QObject::connect(&timer, SIGNAL(timeout()), &gyroscope, SLOT(showGyroscopeReading()));
	QObject::connect(brick.keys(), SIGNAL(buttonPressed(int,int)), QCoreApplication::instance(), SLOT(quit()));

	timer.start();

	return app.exec();
}
