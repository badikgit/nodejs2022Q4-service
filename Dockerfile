FROM node:alpine as build

WORKDIR /app

COPY package*.json .

COPY prisma ./prisma/

RUN npm install

COPY . .


FROM node:alpine as main

COPY --from=build /app ./

CMD ["npm", "run", "prisma:migrate:start"]

EXPOSE ${PORT}