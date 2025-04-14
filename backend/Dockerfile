FROM node:18-alpine

WORKDIR /app

COPY package* .
COPY ./prisma .


RUN npm install 

RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD [ "node","index.js" ]