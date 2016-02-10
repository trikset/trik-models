/* Copyright 2014-2016 CyberTech Labs Ltd.
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

#include <QtCore/qglobal.h>

#if QT_VERSION < QT_VERSION_CHECK(5, 0, 0)
	#include <QtGui/QApplication>
#else
	#include <QtWidgets/QApplication>
#endif

#include <QtCore/QScopedPointer>
#include <QtCore/QTimer>

#include <trikControl/brickInterface.h>
#include <trikControl/brickFactory.h>

#include "gyroscope.h"

int main(int argc, char* argv[])
{
	QApplication app(argc, argv);
	QScopedPointer<trikControl::BrickInterface> brick(trikControl::BrickFactory::create(".", "."));

	cppExample::Gyroscope gyroscope(*brick);
	QTimer timer;
	timer.setInterval(100);
	timer.setSingleShot(false);

	QObject::connect(&timer, SIGNAL(timeout()), &gyroscope, SLOT(showGyroscopeReading()));
	QObject::connect(brick->keys(), SIGNAL(buttonPressed(int,int)), QCoreApplication::instance(), SLOT(quit()));

	timer.start();

	return app.exec();
}
