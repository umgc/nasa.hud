var express = require('express');
var indexRouter = require('./routes/index');

var port = process.env.PORT || 3000;

var app = express();

// Set the routes
app.use('/hud/api', indexRouter);

app.get('/', function (req, res) {
  res.status(200).sendFile(__dirname + '/assets/images/maestro-hud-logo.png');
});

app.listen(port, () => {
  console.log('Server running on port ' + port);
});

module.exports = app;
