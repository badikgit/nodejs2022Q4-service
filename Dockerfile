FROM node:alpine

WORKDIR /app

COPY package*.json .

RUN npm i --force && npm cache clean --force

COPY . .

EXPOSE ${PORT}

CMD ["npm", "run", "prisma:migrate:start"]