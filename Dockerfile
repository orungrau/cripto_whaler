# Version: 0.0.1
FROM hypriot/rpi-node:8.1.3
MAINTAINER Anatoly Myaskov <myskov@me.com>
WORKDIR /usr/src/app
COPY ./ ./
RUN npm install
CMD ["node", "app.js"]