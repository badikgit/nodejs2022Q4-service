FROM node:gallium-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE ${PORT}

CMD ["npm", "run", "start"]