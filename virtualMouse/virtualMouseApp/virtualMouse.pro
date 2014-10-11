# Copyright 2014 CyberTech Labs Ltd.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

QT += core gui widgets network
CONFIG += c++11

TEMPLATE = app

HEADERS  += \
	mainWindow.h \
	mailbox/connection.h \
	mailbox/mailbox.h \
	mailbox/mailboxConnection.h \
	mailbox/mailboxServer.h \
	mailbox/trikServer.h \

SOURCES += \
	main.cpp \
	mainWindow.cpp \
	mailbox/connection.cpp \
	mailbox/mailbox.cpp \
	mailbox/mailboxConnection.cpp \
	mailbox/mailboxServer.cpp \
	mailbox/trikServer.cpp \
