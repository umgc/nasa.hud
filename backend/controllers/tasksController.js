var fs = require('fs');
var yaml = require('js-yaml');
var procDir = './assets/procedures/';
var taskDir = './assets/tasks/';
var imageDir = './assets/images/';
var taskCounter = 0;

// Function to get tasks from procedure file for role selected by an actor
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
                }
            }
        }

    var r = decompose(response);

    var steps = [];
    var images = [];
    var input = r;

    //gathers the steps from decomposition
    for (var i = 0; i < input.length; i++) {
    
        var results = undefined;
        if (input[i]['MaestroStep'] !== undefined)
            results = formatStep(input[i]['MaestroStep']);
        else if (input[i]['taskTitleCard'] !== undefined)
            results = formatStep(input[i]['taskTitleCard']);
        if (results.step !== undefined)
            steps.push(results.step);
        if (results.images.length !== 0)
            images.push(...results.images);
    }
    
    r = { steps, images };
       
    }
    catch(e){
        
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

 /**
     * reformats a step into the proper style
     * @param {object} stepInput unformatted step
     * @returns [{step},{images}] formatted step
     */
    function formatStep(stepInput) {
        
        if (stepInput === "TBD")
            return { name : "TBD", text: ["TBD"], images : [] }; //static text.
        
        var text = [];
        var checkboxes = [];
        var title = "";
        var duration = "";
        var caution = "";
        var warning = "";
        var images = [];
    
        var setSomething = false;
    
        stepInput.forEach(function (item) {
            for (key in item) {
                if (key === "images") {
                    images.push(...item[key].map(function (value) { return imageDir+value.path;}));
                }
                else if (key === "step" || key === "text" || key === "description") {
                    text.push(item[key]);
                    setSomething = true;
                }
                else if (key === "checkboxes") {
                    if (typeof (item[key]) === 'string')
                        checkboxes.push(item[key]);
                    else
                        checkboxes.push(...item[key]);
                    setSomething = true;
                }
                else if (key === "title") {
                    title = item[key];
                    setSomething = true;
                }
                else if (key === "duration") { //formats the time
                    duration = "";
                    if (item[key]["hours"] !== undefined)
                        duration += item[key]["hours"] + ":";
                    else
                        duration += "00:";
    
                    if (item[key]["minutes"])
                        duration += item[key]["minutes"] + ":";
                    else
                        duration += "00:";
    
                    if (item[key]["seconds"])
                        duration += item[key]["seconds"];
                    else
                        duration += "00";
                    setSomething = true;
                }
                else if (key === "caution") {
                    caution = item[key];
                    setSomething = true;
                }
                else if (key === "warning") {
                    warning = item[key];
                    setSomething = true;
                }
                else if (key === "substeps") {
                    item[key].forEach(substep => text.push(substep.step));
                    setSomething = true;
                }
            }
        });
        if (!setSomething)
            return { step: undefined, images };
        else
            return {
                step: {
                    text,
                    checkboxes,
                    title,
                    duration,
                    caution,
                    warning
                }, images
            };
    }
