#!/usr/bin/env python

import http.server
import ssl
import sys
import signal

CERT_ROOT_PATH = "/home/shpark/zulip/volume/zulip/certs/"
CERT_FILE = CERT_ROOT_PATH + "zulip.combined-chain.pem"
KEY_FILE = CERT_ROOT_PATH + "zulip.pem"

#--------------------
# keyboard interrup 처리
# 참고 : https://www.delftstack.com/ko/howto/python/keyboard-interrupt-python/
#--------------------

def sigint_handler(signal, frame):
    print ('KeyboardInterrupt : https server closed!')
    sys.exit(0)
signal.signal(signal.SIGINT, sigint_handler)
    
def main():
    try:
        if len(sys.argv) < 2:
            print("usage : https port")
            return
        print("Web server execution") 
        port = int(sys.argv[1])
        httpd = http.server.HTTPServer(('0.0.0.0', port), http.server.SimpleHTTPRequestHandler)
        httpd.socket = ssl.wrap_socket(httpd.socket, 
                                       certfile=CERT_FILE, 
                                       keyfile=KEY_FILE)
        httpd.serve_forever()
    except Exception as e:
        print("Error : ",e)
        exit(0)

if __name__=="__main__":
    main()
    
    
    