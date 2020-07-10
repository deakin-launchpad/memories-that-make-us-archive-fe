# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package*.json ./
ADD package.json /usr/src/app/package.json
RUN npm install --silent
RUN npm install react-scripts@3.0.0 -g --silent

# Bundle app source
COPY . .

# Specify port
EXPOSE 4020

# start app
CMD ["npm", "start"]

