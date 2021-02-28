"""
Read https://github.com/lobe/lobe-python#lobe-python-api for help and required dependencies
"""

from lobe import ImageModel
import socket
import time

model = ImageModel.load('path/to/exported/model')

SERVER_IP = "192.168.77.1"
SERVER_PORT = 8889
KEEPALIVE_TIMER = 1
MY_HULL_NUMBER = 1

def send_message(message, resource):
    """
    Sends the message to the resource in the correct format
    :param message: Message to be send
    :param resource: Socket to which the data will be delivered
    """
    byte_message = formatted_data_in_bytes(message)
    print(byte_message)
    resource.send(byte_message)


def formatted_data_in_bytes(data: str) -> bytes:
    """
    Reformates string data into a bytes array `<data size>:data`
    :param data: Data to be reformatted
    :return: Data in bytes in the required format
    """
    return bytes(str(len(data)) + ":" + data, encoding='UTF-8')


if __name__ == '__main__':
    server = socket.socket()
    server.connect((SERVER_IP, SERVER_PORT))

    ip, port = server.getsockname()
    send_message('register:{}:{}'.format(ip, port), server)
    send_message('self:{}'.format(MY_HULL_NUMBER), server)

    photo_url = 'http://' + SERVER_IP + ':8080/?action=snapshot'

    try:
        while response != "quit":
            result = model.predict_from_url(photo_url)
            send_message('data:{}'.format(result.prediction), server)

            data = ""
            try:
                data = resource.recv(1024)
            except ConnectionResetError:
                pass

            if data:
                print(data)

            time.sleep(KEEPALIVE_TIMER)

        server.close()
        print("Connection was closed.")
    except KeyboardInterrupt:
        server.close()
        print("Connection was closed.")
    except:
        print("Connection was terminated unexpectedly.")
