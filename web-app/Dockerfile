# Build dependencies (to cache)
FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

CMD ["yarn", "build"]