#!/bin/sh

KEY_FILE=/etc/ssl/overlay5.key
CERT_FILE=/etc/ssl/overlay5.cert

if [ ! -f $KEY_FILE -o ! -f $CERT_FILE ]; then
    echo "Generating cert"
    openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 \
        -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=overlay5.local" \
        -keyout $KEY_FILE -out $CERT_FILE
fi

find /etc/ssl -type f -maxdepth 1 -ls
exec openssl x509 -in $CERT_FILE \
  -text \
  -nocert \
  -noout \
  -certopt no_pubkey \
  -certopt no_sigdump \
  -certopt no_serial \
  -certopt no_extensions
