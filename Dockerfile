FROM node:16.13.2

RUN mkdir -p /usr/src/main
WORKDIR /usr/src/main

COPY package*.json ./

RUN npm install
COPY . .
CMD ["npm", "start"]