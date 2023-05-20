FROM node:16-alpine

WORKDIR /src
COPY .env.production /src/

WORKDIR /src/app
COPY package.json package-lock.json /src/app/
RUN npm install

COPY . /src/app/

EXPOSE ${CLIENT_PORT}

CMD ["npm", "run", "start:prod"]
