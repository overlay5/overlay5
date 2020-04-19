#!/bin/sh

if [ ! -f /etc/ssl/overlay5.key -o ! -f /etc/ssl/overlay5.cert ]; then
    echo "Generating cert"
    openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 \
        -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=overlay5.local" \
        -keyout /etc/ssl/overlay5.key -out /etc/ssl/overlay5.cert
fi

echo "Certificate & key:"
ls -altr /etc/ssl/
exec openssl x509 -in /etc/ssl/overlay5.cert -noout -fingerprint -sha256 -text
