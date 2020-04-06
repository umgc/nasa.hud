var express = require("express");
var indexRouter = require('./routes/index');

var app = express();

// Set the routes
app.use('/hud/api', indexRouter);

app.listen(3000, () => {
 console.log("Server running on port 3000");
});

module.exports = app;