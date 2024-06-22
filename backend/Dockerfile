FROM node:20-alpine
WORKDIR /server
COPY package.json .
RUN npm i
COPY . .
EXPOSE 7000
CMD ["npm", "start"]