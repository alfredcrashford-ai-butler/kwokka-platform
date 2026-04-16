FROM node:22.14

COPY package.json /capybara/package.json
COPY package-lock.json /capybara/package-lock.json

WORKDIR /capybara

ARG NODE_AUTH_TOKEN
COPY .npmrc .npmrc
RUN npm ci
RUN rm -f .npmrc

COPY . /capybara

RUN npm run build

CMD npm run start:prod
