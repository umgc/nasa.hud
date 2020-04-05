var fs = require('fs');
var yaml = require('js-yaml');
var procDir = './procedures/';
var taskDir = './tasks/';
var taskCounter = 0;

// Function to return the parsed steps for each task in the specified procedure file, given a role
exports.get_tasks = function(req, res) {
    var response = [];
    var actorKey; //added 3/27/20
    var actorName; //added 3/27/20
   
    try {
        const file = yaml.safeLoad(fs.readFileSync(procDir+req.params.filename, "utf8"));
        for(const keys of file.columns){ //added 3/27/20
            if(keys.display === req.params.role)
                actorKey = keys.key;
        }
        for(const obj of file.tasks) {
            var role = obj.roles;
            var keys = Object.keys(role);
            for(var key of keys)
            {
                if(role[key] === actorKey) //added 3/27/20
                {   
                    var out = get_steps(obj.file, key);
                   // console.log(out);
                   // console.log('--------------------------');
                    if(out.length != undefined)
                    {
                        //var out = get_steps(obj.file, key);
                        for(var step of out){
                            if(typeof step === "object")
                                response.push(...step);
                            else
                                response.push(step);
                        }
                    }
                    else
                        response.push(out);
                }
            }
        }
        var r = decompose(response);
        for(const i of r){
            console.log(JSON.stringify(i));
        }
    }
    catch(e){
        // Handle file not found exception
        if (e.code === 'ENOENT') {
            res.status(404).send({"error": "The selected file does not exist. Please try again."});
        }
        // Handle invalid yaml files
        else {
            res.status(422).send({"error": "The selected procedure file is unreadable. Please ensure the format and file type (.yml) are correct."});
            console.log(e);
        }
    }
    
    res.status(200).send(r);
}
 
var decompose = function(response){
    var steps = [];
    for(const v of response){
        
            keys = Object.keys(v);
            if(keys.length === 1){
                steps.push(v);
            }
            if(keys.length >1 && typeof v === 'object'){///TRY THIS************************
                for(const k of keys){
                    var stepFormatted = {[k]:v[k]}
                    steps.push(stepFormatted);
                }
            }
            else if(typeof v != 'object')
                steps.push(v);
        
        
    }
    for(const stepsList of steps){
       //console.log(JSON.stringify(stepsList) +'\n');
    }    
    return steps;
}

//function takes filename and role = roles
var get_steps = function(filename, role) {
    //estalblish header keys:pairs here to sync with each step
    var response = [];
    const file = yaml.safeLoad(fs.readFileSync(taskDir+filename, "utf8"));
    var title = [{title: file.title}];
    taskKeyPair = [{taskNumber: taskCounter++}];
    response.push(taskKeyPair);
    response.push(title);
    for(i=0; i<file.roles.length; i++){
        var actorRole = file.roles[i];
        for(property in actorRole){
            if(actorRole[property] === role){
                response.push([file.roles[i]]);
            }
        }
    }
    //console.log(title);
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
                    response.push(...step[key]);
                }
            }
            else if(key.includes("simo")){
                    if(step[key][role] === undefined)
                        continue;
                else if(step[key][role].length != undefined){
                        response.push(step[key][role]);
                }
                else
                    response.push(...step[key][role]);
            }
        }
    }
    //console.log(response);
    return response;
}