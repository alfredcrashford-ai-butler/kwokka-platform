FROM node:22.14

COPY package.json /zebra/package.json
COPY package-lock.json /zebra/package-lock.json

WORKDIR /zebra

ARG NODE_AUTH_TOKEN
COPY .npmrc .npmrc
RUN npm ci
RUN rm -f .npmrc

COPY . /zebra

RUN npm run build

CMD npm run start:prod
