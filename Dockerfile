FROM node:5.4

RUN npm install -g bower

RUN mkdir /app
WORKDIR /app