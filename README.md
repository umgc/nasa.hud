![NASA HUD TEST](https://github.com/umgc/nasa.hud/workflows/NASA%20HUD%20TEST/badge.svg)
![NASA HUD CI](https://github.com/umgc/nasa.hud/workflows/NASA%20HUD%20CI/badge.svg)
![NASA HUD CD](https://github.com/umgc/nasa.hud/workflows/NASA%20HUD%20CD/badge.svg)
![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=umgc_nasa.hud&metric=coverage)

![Sonarcloud Quality](https://sonarcloud.io/api/project_badges/quality_gate?project=umgc_nasa.hud)

# NASA HUD Web App

This project is mono repo that contains both frontend client and backend server located in the respective directory.

## Test and Staging

The application has automated testing hosted through Github Actions ... see .github/workflows for workflow actions.

For Code Coverage Report view [Sonar Dashboard](https://sonarcloud.io/dashboard?id=umgc_nasa.hud)

The project is staged at

- [NASA HUD Staging](https://appdev-nasa-hudweb.herokuapp.com/)
- [NASA HUD API Server](https://appdev-nasa-hudapi.herokuapp.com/)

## Publishing and Storage

Merging to the release branch with a version tag:

stores the image to the [Capstone DockerHub](https://hub.docker.com/u/umgccaps)
publishes the application to the [NASA HUB Web](https://app-nasa-hudweb.herokuapp.com/)

## Local Development Server

To run the Maestro HUD application, both the `frontend` and `backend` applications must deployed/ran. There are a number of ways this can be done, including through docker or local server.

### Prerequisites

- node/npm installed on local machine
- git project cloned
- docker or docker-for-windows installed if running application via docker

### Local Development Server - Docker

Docker allows for the containerization of an application into its own fully functioning operating system. These containers can be deployed to any operating system with the docker service installed and running. To run the Maestro HUD application, do the following:

```bash
$ cd path-to-project\nasa.hud\frontend
$ docker build -t "nasa.hud.frontend" .
$ docker run -d -p 8080:8080 --name "nasa.hud.frontend" nasa.hud.frontend
$ cd path-to-project\nasa.hud\backend
$ docker build -t "nasa.hud.backend" .
$ docker run -d -p 3000:3000 --name "nasa.hud.backend" nasa.hud.backend
```

Both applications should now be running as docker containers. This can be confirmed with:

```bash
$ docker ps
```

This will show all running docker containers. The frontend can be accessed via http://localhost:8080 and the backend can be accessed via http://localhost:3000/hud/api.

Note: web browsers require HTTPS to allow the microphone to be accessed. As such, voice commands will not be operational without HTTPS in place.

### Local Development Server - Local Server Hosting

To run the backend application locally, `npm` is used to run a web server. This can be done by executing the following:

```bash
$ cd path-to-project\nasa.hud\backend\
$ npm install
$ npm run start
```
This will install the required dependencies and run the local server on port 3000. The backend will then be accessible at http://localhost:3000/hud/api.

As the frontend application is static JavaScript, HTML, and CSS, a local server must be installed and ran from the project directory to serve the files. This can be done using any preferred HTTP server. For a detailed guide on installing/deploying a local server and serving static files, see https://threejs.org/docs/#manual/en/introduction/How-to-run-things-locally.

### Local Development Server - IDE

This project can also be ran using many modern integrated development environments (IDEs). The preferred IDE for the Maestro HUD development team is Microsoft Visual Studio Code, which can be downloaded [here](https://code.visualstudio.com/download). These IDEs often include plugins or extensions that allow static files to be ran locally via the web browser. The preferred VS Code extension for serving static files is [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer). With Live Server installed, just right click the `nasa.hud\frontend\index.html` file and select ___Open with Live Server___. Doing so will launch the user's default web browser and serve the frontend application.

From within VS Code, press `F1` to open the context menu and type `Terminal: Create New Integrated Terminal` to open a command line in the IDE. In the command line, run the following commands to run the backend application:

```bash
$ cd path-to-project\nasa.hud\backend\
$ npm install
$ npm run start
```

This will install the necessary dependencies and start the backend service on port 3000. The backend will then be available at http://localhost:3000/hud/api.

## Running unit tests

Both the frontend and backend projects utilize the mocha testing framework in conjunction with testing tools like chai and sinon. To run these unit tests, first ensure that all dependencies have been installed to the local machine. To install project dependencies, run the following:

```bash
$ cd path-to-project\nasa.hud\frontend\
$ npm install
$ cd path-to-project\nasa.hud\backend\ 
$ npm install
```

Once the dependencies are installed, the unit tests can be executed by running the following commands:

```bash
$ cd path-to-project\nasa.hud\frontend\ 
$ npm run test
$ cd path-to-project\nasa.hud\backend\ 
$ npm run test
```

In addition to executing the unit tests, the coverage report will be generated and displayed in the console.

## Further help

To get more help on the NASA HUD project visit the project documentation site at [Capstone Docs](https://1drv.ms/u/s!Aq84NT9YxlnRbqHR5Yb0sbBER6g?e=thSiKA).
