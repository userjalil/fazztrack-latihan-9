FROM node:18-alpine
EXPOSE 3000
WORKDIR /app
ADD app/package*.json ./
RUN npm install
ADD app/. ./
