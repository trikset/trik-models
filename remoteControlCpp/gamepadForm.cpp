/* Copyright 2015 Kudryavtsev Andrey
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
 * This project is modification of TRIK gamepad demo, created by Yurii Litvinov
 * https://github.com/trikset/trik-models/tree/master/desktop-gamepad-demo
 */

#include "gamepadForm.h"

#include "ui_gamepadForm.h"

#include <QMessageBox>

GamepadForm::GamepadForm()
	: QWidget()
	, ui(new Ui::GamepadForm())
{
	// Here all GUI widgets are created and initialized.
	ui->setupUi(this);

	// Disabling buttons since we are not connected to robot yet and can not send any commands.
	setButtonsEnabled(false);

	// Some script constants, matching protocol (extra buttons commands)
	const QString smileScript = "21:direct:brick.smile();";
	const QString sayHiScript = "24:direct:brick.say(\"Hi!\");";

	// Setting actions to extra buttons pressed.
	mButtonsMapper.setMapping(ui->buttonSmile, smileScript);
	mButtonsMapper.setMapping(ui->buttonSayHi, sayHiScript);

	// Connecting mapper to a slot which will process all extra button presses.
	connect(&mButtonsMapper, SIGNAL(mapped(QString)), this, SLOT(onButtonPressed(QString)));

	// Connecting buttons with mapper.
	connect(ui->buttonSmile, SIGNAL(clicked()), &mButtonsMapper, SLOT(map()));
	connect(ui->buttonSayHi, SIGNAL(clicked()), &mButtonsMapper, SLOT(map()));

	// Some script constants, matching protocol (up, down, left, right commands)
	const QString forwardScript = "67:direct:brick.motor(M3).setPower(100);brick.motor(M4).setPower(100);";
	const QString backScript = "73:direct:brick.motor(M3).setPower(-(100));brick.motor(M4).setPower(-(100));";
	const QString leftScript = "70:direct:brick.motor(M3).setPower(-(100));brick.motor(M4).setPower(100);";
	const QString rightScript = "70:direct:brick.motor(M3).setPower(100);brick.motor(M4).setPower(-(100));";
	const QString stopScript = "20:direct:brick.stop();";

	// Setting up mapper for pad buttons, "pressed" signal.
	// Here we provide a command to be sent to a robot instead of id.
	mPadsMapper.setMapping(ui->buttonPadUp, forwardScript);
	mPadsMapper.setMapping(ui->buttonPadDown, backScript);
	mPadsMapper.setMapping(ui->buttonPadLeft, leftScript);
	mPadsMapper.setMapping(ui->buttonPadRight, rightScript);
	mPadsMapper.setMapping(ui->buttonStop, stopScript);

	connect(&mPadsMapper, SIGNAL(mapped(QString)), this, SLOT(onButtonPressed(QString)));

	connect(ui->buttonPadUp, SIGNAL(pressed()), &mPadsMapper, SLOT(map()));
	connect(ui->buttonPadDown, SIGNAL(pressed()), &mPadsMapper, SLOT(map()));
	connect(ui->buttonPadLeft, SIGNAL(pressed()), &mPadsMapper, SLOT(map()));
	connect(ui->buttonPadRight, SIGNAL(pressed()), &mPadsMapper, SLOT(map()));
	connect(ui->buttonStop, SIGNAL(pressed()), &mPadsMapper, SLOT(map()));
}

GamepadForm::~GamepadForm()
{
	// Gracefully disconnecting from host.
	mSocket.disconnectFromHost();
	// Here we do not care for success or failure of operation since we will close anyway.
	mSocket.waitForDisconnected(3000);
	// Deleting GUI.
	delete ui;
}

void GamepadForm::on_connectButton_clicked()
{
	// Getting IP address of a robot.
	const auto ip = ui->robotIpLineEdit->text();

	// Connecting. 8888 is hardcoded here since it is default port on TRIK.
	mSocket.connectToHost(ip, 8888);

	// Waiting for opened connection and checking that connection is actually established.
	if (!mSocket.waitForConnected(3000)) {
		// If not, quitting, to keep things simple.
		QMessageBox::warning(this, "Connection failed", "Failed to connect to robot, will now quit");
		QApplication::quit();
	}

	// Ok, connection is established, now we can enable all buttons.
	setButtonsEnabled(true);
}

void GamepadForm::setButtonsEnabled(bool enabled)
{
	// Here we enable or disable pads and extra buttons depending on given parameter.
	ui->buttonSmile->setEnabled(enabled);
	ui->buttonSayHi->setEnabled(enabled);

	ui->buttonPadLeft->setEnabled(enabled);
	ui->buttonPadRight->setEnabled(enabled);
	ui->buttonPadUp->setEnabled(enabled);
	ui->buttonPadDown->setEnabled(enabled);
	ui->buttonStop->setEnabled(enabled);
}

void GamepadForm::onButtonPressed(const QString &action)
{
	// Checking that we are still connected, just in case.
	if (mSocket.state() != QTcpSocket::ConnectedState) {
		return;
	}

	// Sending command matching protocol (according extra button or pad button pressed) to robot.
	if (mSocket.write((action + "\n").toLatin1()) == -1) {
		setButtonsEnabled(false);
	}
}
