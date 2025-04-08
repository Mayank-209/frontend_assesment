FROM node:18

WORKDIR /app

COPY package*.json .
RUN npm install

COPY src/ src/
COPY public/ public/
COPY tailwind.config.js tailwind.config.js

EXPOSE 3000

CMD ["npm","start"]