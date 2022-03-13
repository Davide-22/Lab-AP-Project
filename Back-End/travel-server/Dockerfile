FROM node:alpine

RUN apk add --no-cache bash



COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3002