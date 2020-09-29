import select
import socket
import time

SERVER_ADDRESS = ('192.168.1.113', 1234)

MAX_CONNECTIONS = 10

INPUTS = list()
OUTPUTS = list()


def get_non_blocking_server_socket():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setblocking(0)

    server.bind(SERVER_ADDRESS)

    server.listen(MAX_CONNECTIONS)

    return server


def handle_readables(readables, server):
    for resource in readables:
        if resource is server:
            connection, client_address = resource.accept()
            connection.setblocking(0)
            INPUTS.append(connection)
            print("New connection from {address}".format(address=client_address))
        else:
            data = ""
            try:
                data = resource.recv(1024)

            except ConnectionResetError:
                pass

            if data:  # and not str(data).__contains__('keepalive'):
                print("getting data: {data}".format(data=data))

                if resource not in OUTPUTS:
                    OUTPUTS.append(resource)
                    resource.send(bytes('15:register:1234:1', encoding='UTF-8'))

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
            resource.send(bytes('9:keepalive', encoding='UTF-8'))
            resource.send(bytes('16:data:messageTo_2', encoding='UTF-8'))
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
            time.sleep(1)
    except KeyboardInterrupt:
        clear_resource(server_socket)
        print("Server stopped! Thank you for using!")