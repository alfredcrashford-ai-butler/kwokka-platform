FROM node:22.14

COPY package.json /pawsome-elements-backend/package.json
COPY package-lock.json /pawsome-elements-backend/package-lock.json

WORKDIR /pawsome-elements-backend

ARG NODE_AUTH_TOKEN
COPY .npmrc .npmrc
RUN npm ci
RUN rm -f .npmrc

COPY . /pawsome-elements-backend

RUN npm run build

CMD npm run start:prod
