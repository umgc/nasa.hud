FROM node:alpine

ENV PORT 8081
RUN echo "$PWD"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
RUN echo "$PWD"
COPY ./backend/package*.json ./

# Bundle app source
RUN npm install --production

COPY ./backend/assets assets/
COPY ./backend/controllers controllers/
COPY ./backend/routes routes/
COPY ./backend/app.js .

EXPOSE ${PORT}

CMD ["node", "app.js" ]