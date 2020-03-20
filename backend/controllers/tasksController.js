var fs = require('fs');
var yaml = require('js-yaml');
var procDir = './procedures/';
var taskDir = './tasks/';

// Function to return the parsed steps for each task in the specified procedure file, given a role
exports.get_tasks = function(req, res) {
    var response = [];
    try {
        const file = yaml.safeLoad(fs.readFileSync(procDir+req.params.filename, "utf8"));
        for(const obj of file.tasks) {
            var role = obj.roles;
            var keys = Object.keys(role);
            for(var key of keys)
            {
                if(role[key] === req.params.role)
                {
                    response = get_steps(obj.file, key);
                }
            }
        }
    }
    catch(e){
        // Handle file not found exception
        if (e.code === 'ENOENT') {
            res.status(404).send({"error": "The selected file does not exist. Please try again."});
        }
        // Handle invalid yaml files
        else {
            res.status(420).send({"error": "The selected procedure file is unreadable. Please ensure the format and file type (.yml) are correct."});
            console.log(e);
        }
    }
    res.status(200).send(response);
}

var get_steps = function(filename, role) {
    var response = [];
    const file = yaml.safeLoad(fs.readFileSync(taskDir+filename, "utf8"));
    for(const step of file.steps)
    {
        var keys = Object.keys(step);
        for(const key of keys)
        {
            if(key.includes(role))
                response.push(step[role]);
            else if(key.includes("simo")) {
                response.push(step[key][role]);
            }
        }
    }
    return response;
}