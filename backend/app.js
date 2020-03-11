var express = require("express");
var app = express();
var wiki = require('./controllers/wiki.js');

app.use('/hud', wiki);

app.listen(3000, () => {
 console.log("Server running on port 3000");
});