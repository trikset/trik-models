# Copyright 2014 CyberTech Labs Ltd.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

TRIKRUNTIME_SOURCES_PATH = ../../trikRuntime
TRIKRUNTIME_PATH = $$TRIKRUNTIME_SOURCES_PATH/bin/arm-release

TEMPLATE = app
CONFIG += console

QT -= gui

INCLUDEPATH += \
	$$TRIKRUNTIME_SOURCES_PATH/trikControl/include/ \

LIBS += -L$$TRIKRUNTIME_PATH -ltrikControl -ltrikKernel

QMAKE_LFLAGS += -Wl,-O1,-rpath,.

QMAKE_CXXFLAGS += -std=c++11

HEADERS += \
	gyroscope.h \

SOURCES += \
	main.cpp \
