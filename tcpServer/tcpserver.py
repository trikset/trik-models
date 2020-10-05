import select
import socket
import time

SERVER_ADDRESS = ('192.168.1.113', 1234)

MAX_CONNECTIONS = 10

KEEPALIVE_TIMER = 1

INPUTS = list()
OUTPUTS = list()


def get_non_blocking_server_socket():
    """
    Creates non blocking server bonded on SERVER_ADDRESS
    :return: server instance
    """
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setblocking(False)

    server.bind(SERVER_ADDRESS)

    server.listen(MAX_CONNECTIONS)

    return server


def formatted_data_in_bytes(data: str) -> bytes:
    """
    Reformates string data into a bytes array `<data size>:data`
    :param data: Data to be reformatted
    :return: Data in bytes in the required format
    """
    return bytes(str(len(data)) + ":" + data, encoding='UTF-8')


def handle_readables(readables, server):
    """
    Processing the occurrence of events at the inputs.
    :param readables: list of sockets
    :param server:
    :return:
    """
    for resource in readables:
        if resource is server:
            connection, client_address = resource.accept()
            connection.setblocking(False)
            INPUTS.append(connection)
            print("New connection from {address}".format(address=client_address))
        else:
            data = ""
            try:
                data = resource.recv(1024)

            except ConnectionResetError:
                pass

            if data:
                data = str(data)
                if resource not in OUTPUTS:
                    OUTPUTS.append(resource)
                    resource.send(formatted_data_in_bytes('connection:192.168.1.113:1234:1'))

                if data.find("keyword") != -1:
                    print("Keyword founded")
                    resource.send(formatted_data_in_bytes('data:I find keyword in {data}'.format(data=data)))

                print("getting data: {data}".format(data=data))
            else:
                clear_resource(resource)


def clear_resource(resource):
    """
    Close connection and cleaning up socket resources
    :param resource: Connection to be closed
    :return:
    """
    if resource in OUTPUTS:
        OUTPUTS.remove(resource)
    if resource in INPUTS:
        INPUTS.remove(resource)
    resource.close()

    print('closing connection ' + str(resource))


def handle_writables(writables):
    """
    This event occurs when the space in the buffer is freed for recording.
    :param writables: list of sockets
    :return:
    """
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
            # We use sleep here because we don't want to spam into a socket.
            # You can check what I mean by using `nc -v <server ip>` with deleted time.sleep
            time.sleep(KEEPALIVE_TIMER)
    except KeyboardInterrupt:
        clear_resource(server_socket)
        print("Server stopped! Thank you for using!")
