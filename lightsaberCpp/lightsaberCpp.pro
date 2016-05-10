# Copyright 2016 CyberTech Labs Ltd.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#     http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

TRIK_RUNTIME_DIR = ../../trikRuntime

QT += core

TEMPLATE = app
TARGET = lightsaberCpp

CONFIG += c++11 console
CONFIG -= app_bundle

DESTDIR = .

include($$TRIK_RUNTIME_DIR/trikControl/trikControlExport.pri)

SOURCES += main.cpp \
	accelerometerListener.cpp \

HEADERS += \
	accelerometerListener.h \
