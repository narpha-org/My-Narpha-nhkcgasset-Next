FROM node:16.14.2-alpine3.15

ENV TZ Asia/Tokyo

WORKDIR /usr/src/app

COPY ./ ./
RUN apk update && apk add bash
RUN npm install

CMD ["npm", "run", "dev"]

