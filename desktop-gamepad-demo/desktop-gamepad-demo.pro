#-------------------------------------------------
#
# Project created by QtCreator 2015-07-09T15:06:56
#
#-------------------------------------------------

QT       += core gui network
CONFIG += c++11

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = desktop-gamepad-demo
TEMPLATE = app


SOURCES += main.cpp\
		gamepadForm.cpp

HEADERS  += gamepadForm.h

FORMS    += gamepadForm.ui
