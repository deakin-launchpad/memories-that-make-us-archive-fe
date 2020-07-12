# base image
FROM node:10-alpine

WORKDIR /app 
COPY . . 

EXPOSE 4020

RUN npm install 

RUN npm rebuild node-sass

CMD ["npm","start"]

