FROM node:alpine3.19

RUN apk update && apk add aws-cli

WORKDIR /root/app
COPY . .

RUN npm ci

ENTRYPOINT [ "npm", "run", "server" ]