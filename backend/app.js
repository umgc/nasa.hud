var express = require("express");
var app = express();
const fs = require("fs");
const path = require("path");
var yaml = require("js-yaml");

app.get("/lint", function(req, res) {
    var response;
    try {
        response = yaml.safeLoad(fs.readFileSync("./procedures/procedures_EVA1.yml", "utf8"));
        console.log(response);
    }
    catch(e)
    {
        response = "The selected procedure file is unreadable. Please ensure the format and file type (.yml) are correct.";
        console.log(e);
    }
    res.json(response);
   })

app.listen(3000, () => {
 console.log("Server running on port 3000");
});