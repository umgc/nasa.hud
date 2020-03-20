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
                    var out = get_steps(obj.file, key);
                    if(out.length != undefined)
                    {
                        for(var step of out){
                            if(typeof step === "object")
                                response.push(...step);
                            else
                                response.push(step);
                        }
                    }
                    else
                        response.push(out);
                    // response.push(...get_steps(obj.file, key));
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
    console.log(JSON.stringify(file));
    for(const step of file.steps)
    {
        var keys = Object.keys(step);
        for(const key of keys)
        {
            if(key.includes(role)){
                if(step[key] === undefined)
                    continue;
                else if(step[key].length != undefined)
                    response.push(step[key]);
                else
                {
                    // console.log("!!!!!!!!!!!!!!!!!");
                    // console.log(step[key]);
                    response.push(...step[key]);
                }
            }
            else if(key.includes("simo")){
                if(step[key][role] === undefined)
                    continue;
                else if(step[key][role].length != undefined){
                    // console.log("!!!!!!!!!!!!!!!!!");
                    // console.log(step[key][role]);
                    response.push(step[key][role]);
                }
                else
                    response.push(...step[key][role]);
            }
        }
    }
    return response;
}