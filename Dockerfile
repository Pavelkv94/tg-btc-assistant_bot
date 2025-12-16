FROM node:22

# Install dependencies for Firefox
RUN apt-get update && apt-get install -y wget libgtk-3-0 libdbus-glib-1-2 libxt6 libx11-xcb1 libxcomposite1 libasound2 libdrm2 libxdamage1 libxfixes3 libxrandr2 libxrender1 libgtk-3-0 libdbus-glib-1-2 \
    && wget https://ftp.mozilla.org/pub/firefox/releases/112.0/linux-x86_64/en-US/firefox-112.0.tar.bz2 \
    && tar xjf firefox-112.0.tar.bz2 -C /opt/ \
    && ln -s /opt/firefox/firefox /usr/local/bin/firefox \
    && rm firefox-112.0.tar.bz2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . .

CMD ["npm","run","start"]