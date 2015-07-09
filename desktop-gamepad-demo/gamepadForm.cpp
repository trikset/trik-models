/* Copyright 2015 CyberTech Labs Ltd.
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

	// Setting mapper for "magic" buttons.
	// First, providing mapper with information about button id's.
	mButtonsMapper.setMapping(ui->button1, 1);
	mButtonsMapper.setMapping(ui->button2, 2);
	mButtonsMapper.setMapping(ui->button3, 3);
	mButtonsMapper.setMapping(ui->button4, 4);
	mButtonsMapper.setMapping(ui->button5, 5);

	// Second, connecting mapper to a slot which will process all magic button presses.
	connect(&mButtonsMapper, SIGNAL(mapped(int)), this, SLOT(onButtonPressed(int)));

	// Third, connecting buttons with mapper.
	connect(ui->button1, SIGNAL(clicked()), &mButtonsMapper, SLOT(map()));
	connect(ui->button2, SIGNAL(clicked()), &mButtonsMapper, SLOT(map()));
	connect(ui->button3, SIGNAL(clicked()), &mButtonsMapper, SLOT(map()));
	connect(ui->button4, SIGNAL(clicked()), &mButtonsMapper, SLOT(map()));
	connect(ui->button5, SIGNAL(clicked()), &mButtonsMapper, SLOT(map()));

	// Setting up mapper for pad buttons, "pressed" signal. Here we provide a command to be sent to a robot instead of
	// id, since all buttons must use different coordinates.
	mPadsDownMapper.setMapping(ui->buttonPad1Up, "pad 1 0 -100");
	mPadsDownMapper.setMapping(ui->buttonPad1Down, "pad 1 0 100");
	mPadsDownMapper.setMapping(ui->buttonPad1Left, "pad 1 -100 0");
	mPadsDownMapper.setMapping(ui->ButtonPad1Right, "pad 1 100 0");

	mPadsDownMapper.setMapping(ui->buttonPad2Up, "pad 2 0 -100");
	mPadsDownMapper.setMapping(ui->buttonPad2Down, "pad 2 0 100");
	mPadsDownMapper.setMapping(ui->buttonPad2Left, "pad 2 -100 0");
	mPadsDownMapper.setMapping(ui->ButtonPad2Right, "pad 2 100 0");

	connect(&mPadsDownMapper, SIGNAL(mapped(QString)), this, SLOT(onPadPressed(QString)));

	connect(ui->buttonPad1Up, SIGNAL(pressed()), &mPadsDownMapper, SLOT(map()));
	connect(ui->buttonPad1Down, SIGNAL(pressed()), &mPadsDownMapper, SLOT(map()));
	connect(ui->buttonPad1Left, SIGNAL(pressed()), &mPadsDownMapper, SLOT(map()));
	connect(ui->ButtonPad1Right, SIGNAL(pressed()), &mPadsDownMapper, SLOT(map()));

	connect(ui->buttonPad2Up, SIGNAL(pressed()), &mPadsDownMapper, SLOT(map()));
	connect(ui->buttonPad2Down, SIGNAL(pressed()), &mPadsDownMapper, SLOT(map()));
	connect(ui->buttonPad2Left, SIGNAL(pressed()), &mPadsDownMapper, SLOT(map()));
	connect(ui->ButtonPad2Right, SIGNAL(pressed()), &mPadsDownMapper, SLOT(map()));

	// Setting up mapper for "released" signal of pad buttons. Here we need only id of a pad, so it is pretty simple.
	mPadsUpMapper.setMapping(ui->buttonPad1Up, 1);
	mPadsUpMapper.setMapping(ui->buttonPad1Down, 1);
	mPadsUpMapper.setMapping(ui->buttonPad1Left, 1);
	mPadsUpMapper.setMapping(ui->ButtonPad1Right, 1);

	mPadsUpMapper.setMapping(ui->buttonPad2Up, 2);
	mPadsUpMapper.setMapping(ui->buttonPad2Down, 2);
	mPadsUpMapper.setMapping(ui->buttonPad2Left, 2);
	mPadsUpMapper.setMapping(ui->ButtonPad2Right, 2);

	connect(&mPadsUpMapper, SIGNAL(mapped(int)), this, SLOT(onPadReleased(int)));

	connect(ui->buttonPad1Up, SIGNAL(released()), &mPadsUpMapper, SLOT(map()));
	connect(ui->buttonPad1Down, SIGNAL(released()), &mPadsUpMapper, SLOT(map()));
	connect(ui->buttonPad1Left, SIGNAL(released()), &mPadsUpMapper, SLOT(map()));
	connect(ui->ButtonPad1Right, SIGNAL(released()), &mPadsUpMapper, SLOT(map()));

	connect(ui->buttonPad2Up, SIGNAL(released()), &mPadsUpMapper, SLOT(map()));
	connect(ui->buttonPad2Down, SIGNAL(released()), &mPadsUpMapper, SLOT(map()));
	connect(ui->buttonPad2Left, SIGNAL(released()), &mPadsUpMapper, SLOT(map()));
	connect(ui->ButtonPad2Right, SIGNAL(released()), &mPadsUpMapper, SLOT(map()));
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

	// Connecting. 4444 is hardcoded here since it is default gamepad port on TRIK.
	mSocket.connectToHost(ip, 4444);

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
	// Here we enable or disable pads and "magic buttons" depending on given parameter.
	ui->button1->setEnabled(enabled);
	ui->button2->setEnabled(enabled);
	ui->button3->setEnabled(enabled);
	ui->button4->setEnabled(enabled);
	ui->button5->setEnabled(enabled);

	ui->buttonPad1Left->setEnabled(enabled);
	ui->ButtonPad1Right->setEnabled(enabled);
	ui->buttonPad1Up->setEnabled(enabled);
	ui->buttonPad1Down->setEnabled(enabled);

	ui->buttonPad2Left->setEnabled(enabled);
	ui->ButtonPad2Right->setEnabled(enabled);
	ui->buttonPad2Up->setEnabled(enabled);
	ui->buttonPad2Down->setEnabled(enabled);
}

void GamepadForm::onButtonPressed(int buttonId)
{
	// Checking that we are still connected, just in case.
	if (mSocket.state() != QTcpSocket::ConnectedState) {
		return;
	}

	// Sending "btn <buttonId>" command to robot.
	if (mSocket.write(QString("btn %1\n").arg(buttonId).toLatin1()) == -1) {
		// If sending failed for some reason, we think that we lost connection and disable buttons.
		setButtonsEnabled(false);
	}
}

void GamepadForm::onPadPressed(const QString &action)
{
	// Here we send "pad <padId> <x> <y>" command.
	if (mSocket.state() != QTcpSocket::ConnectedState) {
		return;
	}

	if (mSocket.write((action + "\n").toLatin1()) == -1) {
		setButtonsEnabled(false);
	}
}

void GamepadForm::onPadReleased(int padId)
{
	// Here we send "pad <padId> up" command.
	if (mSocket.state() != QTcpSocket::ConnectedState) {
		return;
	}

	if (mSocket.write(QString("pad %1 up\n").arg(padId).toLatin1()) == -1) {
		setButtonsEnabled(false);
	}
}
