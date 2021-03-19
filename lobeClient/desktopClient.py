#!/usr/bin/env python3
""" Copyright 2021 Andrei Khodko, CyberTech Labs Ltd.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License. """

# IP робота или студии. Для студии обычно использовать SERVER_IP = '127.0.0.1'
SERVER_IP = '127.0.0.1'
# Борт номер для этого лобе сервера. Выберите не занятый роботами.
MY_HULL_NUMBER = 1
# Порт на котором слушает робот сервер или студия. Обычно это 8889
SERVER_PORT = 8889

# Путь к директории обученной модели Lobe. Работает с TFLite
# По умолчанию ищет в директории этого скрипта.
# Модель это файлы signature.json и например saved_model.tflite. Если хотите прямой указать путь к модели то,
# указывайте путь к папке содержайщей эти файлы, например MODEL_PATH = 'path/to/exported/model'
import sys
MODEL_PATH = sys.path[0]
# Установить True если хотим использовать изображение с камеры ТРИК (нужно запустить mjpg-encoder)
# Установить False если хотим использовать изображение с вебкамеры компьютера
GET_IMAGES_FROM_ROBOT = False
# Номер камеры в ОС Windows. Разные значения активирует разные подключенные камеры (0, 1, 2...)
CAMERA_NUMBER = 0


"""
Простой скрипт для робота или студии. 
while True:
      predict = mailbox.receive(True)
      print(predict)
"""


import subprocess
import sys
import asyncio
import socket
from PIL import Image


# Раз в сколько секунд отправлять keepalive на сервер.
KEEPALIVE_TIMER = 5


def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])


try:
    import cv2
    from lobe import ImageModel
except ImportError:
    install('opencv-python')
    install('git+https://github.com/lobe/lobe-python')
    import cv2
    from lobe import ImageModel


model = ImageModel.load(MODEL_PATH)
CAMERA = cv2.VideoCapture(CAMERA_NUMBER)
PHOTO_PATH = 'http://' + SERVER_IP + ':8080/?action=snapshot'


async def send(message, sock):
    try:
        byte_message = formatted_data_in_bytes(message)
        print("Send:", byte_message)
        async with asyncio.Lock():
            sock.send(byte_message)
        await asyncio.sleep(0.2)
    except ConnectionResetError:
        pass


async def send_message(message: str, sock):
    await send('data:' + message, sock)


def formatted_data_in_bytes(msg: str) -> bytes:
    return bytes(str(len(msg)) + ":" + msg, encoding='UTF-8')


def predict(path: str):
    if GET_IMAGES_FROM_ROBOT:
        return model.predict_from_url(path).prediction
    else:
        ret, frame = CAMERA.read()
        if not ret:
            return "-1"

        color_converted = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        return model.predict(Image.fromarray(color_converted)).prediction


async def send_keepalive(sock):
    while True:
        await send('keepalive', sock)
        await asyncio.sleep(KEEPALIVE_TIMER)


async def send_prediction(sock):
    while True:
        await send_message(predict(PHOTO_PATH), sock)


async def read_data(sock, my_loop):
    data = ""
    while data.find("9:data:quit") == -1:
        await asyncio.sleep(0.2)
        try:
            data = (await my_loop.sock_recv(sock, 255)).decode("utf-8")
        except ConnectionResetError:
            pass

        if data:
            print("Received:", data)

    sock.close()
    my_loop.stop()
    CAMERA.release()


def main():
    loop = asyncio.get_event_loop()
    server = socket.socket()
    try:
        server.connect((SERVER_IP, SERVER_PORT))

        ip, port = server.getsockname()
        asyncio.ensure_future(send('register:{}:{}'.format(port, MY_HULL_NUMBER), server))
        asyncio.ensure_future(send('self:{}'.format(MY_HULL_NUMBER), server))

        asyncio.ensure_future(send_keepalive(server))
        asyncio.ensure_future(send_prediction(server))
        asyncio.ensure_future(read_data(server, loop))

        loop.run_forever()
    except KeyboardInterrupt:
        print("Connection was closed.")
    finally:
        server.close()
        loop.stop()


if __name__ == '__main__':
    main()
