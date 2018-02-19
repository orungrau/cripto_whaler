# Version: 0.0.1
FROM node:9.5.0
MAINTAINER Anatoly Myaskov <myskov@me.com>
WORKDIR /usr/src/app
COPY ./ ./
RUN npm install
CMD ["node", "app.js"]