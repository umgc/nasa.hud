var express = require ('express');
var router = express.Router();
const fs = require("fs");
var yaml = require("js-yaml");

router.get('/', function(req, res) {
    res.send('Maestro HUD Backend Services')
})

router.get('/getfiles', function(req, res) {
    var response = [];
    fs.readdirSync('./procedures/').forEach(file => {
        response.push(file);
    })
    res.send(response);
})

router.get("/lint/:filename", function(req, res) {
    var response;
    try {
        response = yaml.safeLoad(fs.readFileSync("./procedures/"+req.params.filename, "utf8"));
    }
    catch(e)
    {
        // Handle file not found exception
        if(e.code === 'ENOENT') {
            response = "The selected procedure file cannot be found.";
            console.log(e);
        }
        // Handle invalid yaml files
        else {
            response = "The selected procedure file is unreadable. Please ensure the format and file type (.yml) are correct.";
            console.log(e);
        }
    }
    res.json(response);
   })

module.exports = router;