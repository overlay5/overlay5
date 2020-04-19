FROM nginx

COPY cert.sh /tmp/

RUN apt-get update \
&& DEBIAN_FRONTEND=noninteractive \
   apt-get install -y --no-install-recommends \
     openssl \
     ca-certificates \
&& rm -rf /var/lib/apt/lists/* \
&& chmod +x /tmp/cert.sh

CMD [ "/bin/sh", "-c", "/tmp/cert.sh && exec nginx -g 'daemon off;'" ]
