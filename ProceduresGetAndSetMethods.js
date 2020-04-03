//Global variables
var procedureName;
var actorsList = [];
var taskList = [];
var taskRolesList = [];
var actorRole;
var taskTitle;
var taskdetails = [];

//Gets a list of procedures
//assume we will get a file with a list of procedures
function getProcedures(){}

function setProcedureName(procedure){
    procedureName = '{procedure_name:"' + procedure.procedure_name+ '"}';
}


//Gets a list of actors associated with this procedure
//returns JSON formatted results
function setActorsListForProcedure(procedure){
    
    for(i = 0; i <procedure.columns.length; i++){
        actorsList.push(procedure.columns[i]);
    }
    actorsList;
}

//Get a list of tasks associated with actor selection
//role name = response.columns[i].key[j] or in Matts case actorName = 'response.key'
//returns JSON formatted results
function setTasksListForActor(procedure, actorKey) {
    
    for (i = 0; i < procedure.tasks.length; i++) {
        var allTasks = procedure.tasks[i].roles;

        for (property in allTasks) {
            if (allTasks[property] === actorKey)
                taskList.push(procedure.tasks[i]);
        }
    }
    
}

//needs work
function getCrewName(actorName){
    var taskList = getTasksListForActor(actorName);
    for(i =0; i<taskList.length; i++){

    }
}

//provides a list of all task roles
//function used as argument for "getRoleKey(object, roleName)", to obtain actors specific role key
function setTasksRoleKey(procedure, actorKey){
    
    for(i=0; i<procedure.tasks.length; i++){
        taskRolesList.push(procedure.tasks[i].roles);
    }
    for(i=0; i<taskRolesList.length; i++){
        for(var prop in taskRolesList[i]){
            if(taskRolesList[i].hasOwnProperty(prop)){
                if(taskRolesList[i][prop] === actorKey)
                    actorRole = '{name:"'+prop+'"}';
            }
        }
    }
    
}

//Get the task file title name and return in JSON
function setTaskTitle(taskFileInJson){
    taskTitle = '{"title":' +JSON.stringify(taskFileInJson.title)+'}';
    
}

//returns the details for an actors task
function setTaskDetails(taskInJson, crew){
    for(i=0; i<taskInJson.roles.length; i++){
        var roles = taskInJson.roles[i];
        for(property in roles){
            if(roles[property] === crew)
                taskdetails.push(taskInJson.roles[i])
        }
    }
}

//set Methods need to be called before corresponding get Methods
function getProcedureName(procedure){
    setProcedureName(procedure);
    return procedureName;
}

function getActorsList(response){
    setActorsListForProcedure(response);
    return actorsList;
}

function getTasksListForActor(response, actorKey){
    setTasksListForActor(response, actorKey.key);
    return taskList;
}

function getTaskRoleID(response, actorKey){
    setTasksRoleKey(response, actorKey.key);
    return actorRole;
}

function getTaskName(task){
    setTaskTitle(task);
    return taskTitle;
}

function getTaskDetails(response, actorRole){
    setTaskDetails(response, actorRole.name);
    return actorRole;
}

//tests setter and getter methods for procedure file
console.log(getActorsList(response));
console.log(getTasksListForActor(response, response.columns[1]));
console.log(getTaskRoleID(response, response.columns[1]));
console.log(getProcedureName(response));

