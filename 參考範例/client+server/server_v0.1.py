import socket
import threading
import struct
import hashlib
import base64

PORT = 9877
_address = ""

def create_handshake_resp(handshake):
    key = None
    final_line = ""
    lines = handshake.splitlines()
    for line in lines:
        print(line)
        parts = line.partition(b": ")
        if parts[0] == "Sec-WebSocket-Key":
            key = parts[2]


    magic = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

    accept_key = base64.b64encode(hashlib.sha1(key+magic).digest())

    return (
        "HTTP/1.1 101 Switching Protocols\r\n"
        "Upgrade: WebSocket\r\n"
        "Connection: Upgrade\r\n"
        "Sec-WebSocket-Accept: " + accept_key + "\r\n\r\n")


def handle(s, addr):
    data = s.recv(1024)
    response = create_handshake_resp(data)
    s.sendto(response, addr)
    lock = threading.Lock()
    while 1:
        print("Waiting for data from", addr)
        data = s.recv(1024)
        print("Done")
        if not data:
            print("No data")
            break

        print('Data from', addr, ':', data)

    print('Client closed:', addr)
    lock.acquire()
    clients.remove(s)
    lock.release()
    s.close()

def start_server():
    print('STARTING SERVER...')
    s = socket.socket()
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(('', PORT))
    s.listen(1)
    print('SERVER STARTED')
    while 1:
        conn, addr = s.accept()
        print('NEW CONNECTION ['+str(len(clients))+'], connected by ', addr)
        clients.append(conn)
        threading.Thread(target = handle, args = (conn, addr)).start()

clients = []
start_server()