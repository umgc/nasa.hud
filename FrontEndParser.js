//response = JSON formatted YAML file.  Variable declared in Ryan Cohen code
        //must save Matts return JSON into a variable

        //Gets a list of procedures
        //assume we will get a file with a list of procedures
        function getProcedures(){}

        //Gets a list of actors associated with this procedure
        //returns JSON formatted results
        function getActorsList(){
            var actorsList = [];
            for(i = 0; i <response.columns.length; i++){
                actorsList.push(response.columns[i]);
            }
            return JSON.stringify(actorsList);
        }

        //Get a list of tasks associated with actor selection
        //role name = response.columns[i].key[j] or in Matts case actorName = response.key
        //returns JSON formatted results
        function getTasksListForActor(actorName) {
            var taskList = [];
            for (i = 0; i < response.tasks.length; i++) {
                var allTasks = response.tasks[i].roles;
        
                for (property in allTasks) {
                    if (allTasks[property] === actorName)
                        taskList.push(response.tasks[i]);
                }
            }
            return JSON.stringify(taskList);
        }
        //used to test output of getActorsList() & getTaskListForRole() functions
        console.log(getActorsList());
        console.log(getTasksListForActor("EV1"));