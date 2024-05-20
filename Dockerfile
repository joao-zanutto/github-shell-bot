FROM node:alpine

RUN apk update && apk add aws-cli

WORKDIR /root/app
COPY . .

RUN npm ci

ENTRYPOINT [ "npm", "run", "server" ]