var fs = require('fs');
var yaml = require('js-yaml');
var procDir = './procedures/';
var taskDir = './tasks/';
var taskCounter = 0;

// Function to get tasks from procedure file for role selected by actor

exports.get_tasks = function(req, res) {
    var response = [];
    var actorKey; 
    var actorName; 
   
    try {
        const file = yaml.safeLoad(fs.readFileSync(procDir+req.params.filename, "utf8"));
        for(const keys of file.columns){ 
            if(keys.display === req.params.role)
                actorKey = keys.key;
        }
        for(const obj of file.tasks) {
            var role = obj.roles;
            var keys = Object.keys(role);
            for(var key of keys)
            {
                if(role[key] === actorKey) 
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
                }
            }
        }

       var r = decompose(response);
       
    }
    catch(e){
        
        if (e.code === 'ENOENT') {
            res.status(404).send({"error": "The selected file does not exist. Please try again."});
        }
        // Handle invalid yaml files
        else {
            res.status(420).send({"error": "The selected procedure file is unreadable. Please ensure the format and file type (.yml) are correct."});
            console.log(e);
        }
    }
    
    res.status(200).send(r);
}


//function to extract independent task steps and decompose into manageable objects
var decompose = function(response){
    var steps = [];
    for(const v of response){
        
            keys = Object.keys(v);
            if(keys.length === 1){
                steps.push(v);
            }
            if(keys.length >1 && typeof v === 'object'){
                for(const k of keys){
                    var stepFormatted = {[k]:v[k]}
                    steps.push(stepFormatted);
                }
            }
            else if(typeof v != 'object')
                steps.push(v);
        
        
    }
    return steps;
}

//function to get headers and steps from task files 

var get_steps = function(filename, role) {
    //estalblish header keys:pairs here to sync with each step
    var response = [];
    const file = yaml.safeLoad(fs.readFileSync(taskDir+filename, "utf8"));
    var title = {title: file.title};
    taskKeyPair = {taskNumber: taskCounter++};
    for(i=0; i<file.roles.length; i++){
        var actorRole = file.roles[i];
        for(property in actorRole){
            if(actorRole[property] === role){
                response.push([{taskTitleCard:[taskKeyPair, title,file.roles[i]]}]);
            }
        }
    }
  
    for(const step of file.steps)
    {
        var keys = Object.keys(step);
        for(const key of keys)
        {
            if(key.includes(role)){
                if(step[key] === undefined)
                    continue;
                else if(step[key].length != undefined && step[key].length === 1)
                    response.push([{MaestroStep:step[key]}]);
               
                else if(step[key].length != undefined && step[key].length > 1)
                    response.push([{MaestroStep:step[key]}]); 
            }
            else if(key.includes("simo")){
                    if(step[key][role] === undefined)
                        continue;
                else if(step[key][role].length != undefined && step[key][role].length === 1){
                        response.push([{MaestroStep:step[key][role]}]);
                }
                else if(step[key][role].length != undefined && step[key][role].length > 1){
                        response.push([{MaestroStep:step[key][role]}]);
                }
            }
        }
    }
   
    return response;
}