FROM node:alpine

ENV PORT 8081

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Bundle app source
RUN npm install --production

COPY ./assets assets/
COPY ./controllers controllers/
COPY ./routes routes/
COPY ./app.js .

EXPOSE ${PORT}

CMD ["node", "app.js" ]