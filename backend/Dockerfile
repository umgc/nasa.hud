FROM node:alpine

ENV PORT 8081
ENV BASE_PATH '.'

RUN echo "$PWD"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
RUN echo "$PWD"
COPY ${BASE_PATH}/package*.json ./

# Bundle app source
RUN npm install --production

COPY ${BASE_PATH}/assets assets/
COPY ${BASE_PATH}/controllers controllers/
COPY ${BASE_PATH}/routes routes/
COPY ${BASE_PATH}/app.js .

EXPOSE ${PORT}

CMD ["node", "app.js" ]