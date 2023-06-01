FROM node:16-alpine

WORKDIR /src
COPY package.json package-lock.json /src/
RUN npm install

COPY . /src/

EXPOSE ${CLIENT_PORT}

CMD ["npm", "run", "start"]
