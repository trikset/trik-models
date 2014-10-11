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

#include "mainWindow.h"

#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QApplication>
#include <QtGui/QMouseEvent>
#include <QtGui/QScreen>

#include "windows.h"

using namespace virtualMouse;
using namespace mailbox;

MainWindow::MainWindow(QWidget *parent)
	: QMainWindow(parent)
	, mMailbox(8889)
{
	this->setWindowTitle("TRIK Virtual mouse");

	mMailbox.setHullNumber(0);
	connect(&mMailbox, &Mailbox::newMessage, this, &MainWindow::onMessage);
	mMailbox.connect("192.168.1.1");
}

void MainWindow::onMessage(int sender, QString const &message)
{
	Q_UNUSED(sender);

	if (message == "enterPressed") {
		mouse_event(MOUSEEVENTF_LEFTDOWN, QCursor::pos().x(), QCursor::pos().y(), 0, 0);
	} else if (message == "enterReleased") {
		mouse_event(MOUSEEVENTF_LEFTUP, QCursor::pos().x(), QCursor::pos().y(), 0, 0);
	} else if (message == "escPressed") {
		mouse_event(MOUSEEVENTF_RIGHTDOWN, QCursor::pos().x(), QCursor::pos().y(), 0, 0);
	} else if (message == "escReleased") {
		mouse_event(MOUSEEVENTF_RIGHTUP, QCursor::pos().x(), QCursor::pos().y(), 0, 0);
	} else if (message == "upPressed") {
		keybd_event(VK_UP, 0, 0, 0);
	} else if (message == "upReleased") {
		keybd_event(VK_UP, 0, KEYEVENTF_KEYUP, 0);
	} else if (message == "downPressed") {
		keybd_event(VK_DOWN, 0, 0, 0);
	} else if (message == "downReleased") {
		keybd_event(VK_DOWN, 0, KEYEVENTF_KEYUP, 0);
	} else {
		auto data = message.split(':')[1];
		auto const coordsStringList = data.split(',');
		if (coordsStringList.size() != 3) {
			return;
		}

		auto x = coordsStringList[1].toInt();
		auto y = coordsStringList[0].toInt();

		x /= 10;
		y /= 10;

		QCursor::setPos(QCursor::pos() + QPoint{x, y});
	}
}
