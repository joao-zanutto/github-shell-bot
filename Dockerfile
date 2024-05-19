FROM node:alpine

RUN apk update && apk add aws-cli

WORKDIR /root/app
COPY . .
COPY key.pem key.pem

RUN npm ci

ENTRYPOINT [ "npm", "run", "server" ]