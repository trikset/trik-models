import select
import socket
import time

SERVER_ADDRESS = ('192.168.1.113', 1234)

MAX_CONNECTIONS = 10

INPUTS = list()
OUTPUTS = list()


def get_non_blocking_server_socket():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setblocking(False)

    server.bind(SERVER_ADDRESS)

    server.listen(MAX_CONNECTIONS)

    return server


def formatted_data_in_bytes(data: str) -> bytes:
    return bytes(str(len(data)) + ":" + data, encoding='UTF-8')


def handle_readables(readables, server):
    for resource in readables:
        if resource is server:
            connection, client_address = resource.accept()
            connection.setblocking(False)
            INPUTS.append(connection)
            print("New connection from {address}".format(address=client_address))
            if connection not in INPUTS:
                print("Send connection info")
                connection.send(formatted_data_in_bytes('connection:192.168.1.113:1234:1'))
        else:
            data = ""
            try:
                data = resource.recv(1024)

            except ConnectionResetError:
                pass

            if data:
                if True or not str(data).__contains__('keepalive'):
                    print("getting data: {data}".format(data=data))

                if resource not in OUTPUTS:
                    OUTPUTS.append(resource)
                    resource.send(formatted_data_in_bytes('connection:192.168.1.113:1234:1'))
            else:
                clear_resource(resource)


def clear_resource(resource):
    if resource in OUTPUTS:
        OUTPUTS.remove(resource)
    if resource in INPUTS:
        INPUTS.remove(resource)
    resource.close()

    print('closing connection ' + str(resource))


def handle_writables(writables):
    for resource in writables:
        try:
            resource.send(formatted_data_in_bytes('keepalive'))
        except OSError:
            clear_resource(resource)


if __name__ == '__main__':
    server_socket = get_non_blocking_server_socket()
    INPUTS.append(server_socket)

    print("Server is running, please, press ctrl+c to stop")
    try:
        while INPUTS:
            readables, writables, exceptional = select.select(INPUTS, OUTPUTS, INPUTS)
            handle_readables(readables, server_socket)
            handle_writables(writables)
            time.sleep(2)
    except KeyboardInterrupt:
        clear_resource(server_socket)
        print("Server stopped! Thank you for using!")
