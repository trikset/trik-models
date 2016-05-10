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

#include "accelerometerListener.h"

#include <cmath>

#include <QtCore/QDebug>

AccelerometerListener::AccelerometerListener(
		trikControl::VectorSensorInterface &accelerometer
		, trikControl::MotorInterface &motor1
		, trikControl::MotorInterface &motor2
		, trikControl::DisplayInterface &display)
	: mAccelerometer(accelerometer)
	, mMotor1(motor1)
	, mMotor2(motor2)
	, mDisplay(display)
{
}

void AccelerometerListener::onTimeout()
{
	const auto a = mAccelerometer.read();
	const auto angle = std::atan2(a[2], -a[0]) / M_PI * 180 + 180;
	mDisplay.addLabel(QString::number(angle), 100, 100);
	mDisplay.redraw();
	mMotor1.setPower(angle * 100 / 360);
	mMotor2.setPower((360 - angle) * 100 / 360);
}
