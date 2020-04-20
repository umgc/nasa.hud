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

- Requires DEV to update

## Running unit tests

Both the frontend and backend projects utilize the mocha testing framework in conjunction with testing tools like chai and sinon. To run these unit tests, first ensure that all dependencies have been installed to the local machine. To install project dependencies, run the following:

```javascript
npm install
```

Once the dependencies are installed, the unit tests can be executed by running the following commands:

```javascript
nasa.hud\frontend\ $ npm run test
nasa.hud\backend\ $ npm run test
```

In addition to executing the unit tests, the coverage report will be generated and displayed in the console.

## Further help

To get more help on the NASA HUD project visit the project documentation site at [Capstone Docs](https://1drv.ms/u/s!Aq84NT9YxlnRbqHR5Yb0sbBER6g?e=thSiKA).
