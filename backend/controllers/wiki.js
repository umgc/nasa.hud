var express = require ('express');
var router = express.Router();
const fs = require("fs");
var yaml = require("js-yaml");
const procDir = './procedures/';

router.get('/', function(req, res) {
    res.send('Maestro HUD Backend Services')
})

router.get('/getfiles', function(req, res) {
    var response = [];
    fs.readdirSync(procDir).forEach(file => {
        response.push(file);
    })
    res.send(response);
})

router.get("/lint/:filename", function(req, res) {
    var response;
    try {
        response = yaml.safeLoad(fs.readFileSync(procDir+req.params.filename, "utf8"));
    }
    catch(e)
    {
        // Handle file not found exception
        if(e.code === 'ENOENT') {
            response = {"error": "The selected procedure file cannot be found."};
            console.log(e);
        }
        // Handle invalid yaml files
        else {
            response = {"error": "The selected procedure file is unreadable. Please ensure the format and file type (.yml) are correct."};
            console.log(e);
        }
    }
    res.json(response);
   })

router.get("/roles/:filename", function(req, res) {
    var roles = [];
    const file = yaml.safeLoad(fs.readFileSync(procDir+req.params.filename, "utf8"));
    for(const role of file.columns){
        roles.push(role.key);
    }
    res.json(roles);
})

router.get("/tasks/:filename/:role", function(req, res) {
    var tasks = [];
    const file = yaml.safeLoad(fs.readFileSync(procDir+req.params.filename, "utf8"));
    for(const obj of file.tasks) {
        var role = obj.roles;
        var keys = Object.keys(role);
        for(var key of keys)
        {
            if(role[key] === req.params.role)
            {
                tasks.push(obj.file);
                for(var task of tasks)
                {
                    // TODO: Add function to parse task files and pass loop through tasks array, passing each task file as a parameter
                }
            }
        }
    }
    res.json(tasks);
})

module.exports = router;