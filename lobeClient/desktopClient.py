"""
Read https://github.com/lobe/lobe-python#lobe-python-api for help and required dependencies
"""
import asyncio
from lobe import ImageModel
import cv2
import socket


model = ImageModel.load('path/to/exported/model')

# SERVER_IP = "192.168.77.1"
SERVER_IP = "127.0.0.1"
SERVER_PORT = 8889
KEEPALIVE_TIMER = 5
MY_HULL_NUMBER = 1

GET_IMAGES_FROM_ROBOT = False
# PHOTO_PATH = 'http://' + SERVER_IP + ':8080/?action=snapshot'
PHOTO_PATH = 'http://192.168.77.1:8080/?action=snapshot'

CAMERA = cv2.VideoCapture(0)


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

        cv2.imwrite("img_name.jpg", frame)
        return model.predict_from_file('img_name.jpg').prediction


async def send_keepalive(sock):
    while True:
        await send('keepalive', sock)
        await asyncio.sleep(KEEPALIVE_TIMER)


async def send_prediction(sock):
    while True:
        await send_message(predict(PHOTO_PATH), sock)


async def read_data(sock, my_loop):
    data = ""
    while data != "9:data:quit":
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


if __name__ == '__main__':
    try:
        loop = asyncio.get_event_loop()

        server = socket.socket()
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
        server.close()
        loop.stop()
