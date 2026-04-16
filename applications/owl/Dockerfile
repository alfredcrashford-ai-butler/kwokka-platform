FROM node:22.14

COPY package.json /owl/package.json
COPY package-lock.json /owl/package-lock.json

WORKDIR /owl

ARG NODE_AUTH_TOKEN
COPY .npmrc .npmrc
RUN npm ci
RUN rm -f .npmrc

COPY . /owl

RUN npm run build

CMD npm run start:prod
