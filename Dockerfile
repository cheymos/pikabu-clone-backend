FROM node:16-alpine as build
WORKDIR /home/app
COPY package*.json ./
RUN npm i
COPY . ./
RUN npm run build
CMD ["node", "dist/main"]
