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
	auto const layout = new QVBoxLayout();
	layout->addWidget(&mMagicButton);
	mMagicButton.setText("Do something");
	this->setCentralWidget(new QWidget());
	this->centralWidget()->setLayout(layout);
	connect(&mMagicButton, &QPushButton::clicked, this, &MainWindow::onMagicButtonClick);

	mMailbox.setHullNumber(0);
	connect(&mMailbox, &Mailbox::newMessage, this, &MainWindow::onMessage);
}

void MainWindow::onMagicButtonClick()
{
	QCursor::setPos({0, 0});
}

void MainWindow::onMessage(int sender, QString const &message)
{
	Q_UNUSED(sender);

	if (message == "enter") {
		mouse_event(MOUSEEVENTF_LEFTDOWN, QCursor::pos().x(), QCursor::pos().y(), 0, 0);
		mouse_event(MOUSEEVENTF_LEFTUP, QCursor::pos().x(), QCursor::pos().y(), 0, 0);
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
