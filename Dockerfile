FROM node:12 AS client

WORKDIR /usr/src/app/client

COPY client/package*.json ./

RUN npm install

COPY client .

CMD [ "npm", "run", "build" ]


FROM node:12.18.3-buster-slim@sha256:dd6aa3ed10af4374b88f8a6624aeee7522772bb08e8dd5e917ff729d1d3c3a4f

WORKDIR /usr/src/app

COPY server/package*.json ./

RUN npm install

RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y libxss1 google-chrome-stable \
     && rm -rf /var/lib/apt/lists/* \
     && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
     && chmod +x /usr/sbin/wait-for-it.sh


COPY server .
COPY --from=client /usr/src/app/client/build ./build

EXPOSE 8080
CMD [ "node", "index.js" ]
