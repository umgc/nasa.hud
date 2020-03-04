

var mainWindow = {

    steps: [],
    diagrams: [],
    currentStepName: undefined,

    voiceControl: undefined,

    mission: {},

    init: function () {

        $.get("mission.json")
            .fail(function (error) {
                console.log(error);
                alert("Failed to download mission data");
            })
            .done(function (data) {
                mainWindow.mission = data;
                mainWindow.selectProcedure();
            });

        mainWindow.voiceControl = new anycontrol();
    },

    selectProcedure: function () {


        var html = '<div class="container">';
        html += '<div class="card" style="width: 18rem;">';
        html += '<div class="cardbody">';
        html += '<h5 class="card-title">Procedure Select</h5>';
        html += ' <p class="card-text">Please select a procedure to continue</p >';

        html += '<div class="dropdown ">';
        html += '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
        html += 'Procedure Select';
        html += '</button>';
        html += '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">';
        html += mainWindow.mission.reduce(function (output, item) {
            return output += '<a class="dropdown-item" onClick=\"mainWindow.selectRole(\'' + item['name'] + '\')\" >' + item['name'] + '</a>';
        }, "");
            
        html += '</div>';
        html += '</div>';

        html += '</div>';
        html += '</div>';
        html += '</div>';
        $('#mainwindow').html(html); 
    },

    selectRole: function (procedureName) {
        var currentProcedure = mainWindow.getProcedure(procedureName);

        console.log(currentProcedure);
        var html = '<div class="container">';
        html += '<div class="card" style="width: 18rem;">';
        html += '<div class="cardbody">';
        html += '<h5 class="card-title">Role Select</h5>';
        html += ' <p class="card-text">Please select a role to continue</p >';

        html += '<div class="dropdown ">';
        html += '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
        html += 'Role Select';
        html += '</button>';
        html += '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">';
        html += currentProcedure.roles.reduce(function (output, item) {
            return output += '<a class="dropdown-item" onClick=\"mainWindow.downloadSteps(\'' + procedureName + '\', \'' + item + '\')\" >' + item + '</a>';
        }, "");

        html += '</div>';
        html += '</div>';

        html += '</div>';
        html += '</div>';
        html += '</div>';
        $('#mainwindow').html(html); 
    },

    downloadSteps: function (procedureName, roleName) {

        var url = procedureName + "/" + roleName + ".json";

        $.get(url)
            .fail(function (error) {

                alert("Could not download steps");

            })
            .done(mainWindow.start);

    },

    start: function (data) {

        mainWindow.diagrams = data.diagrams;
        mainWindow.steps = data.steps;
        mainWindow.linkSteps(mainWindow.steps);
        mainWindow.currentStepName = mainWindow.steps[0].name;
        mainWindow.displayStep(mainWindow.currentStepName);

        $(document).keyup(mainWindow.keyhandler);
    },

    getProcedure: function (procedureName) {
        return mainWindow.getFromName(mainWindow.mission, procedureName);
    },


    getFromName : function(array, nameOfThing) {
        for (var i = 0; i < array.length; i++)
            if (array[i].name === nameOfThing)
                return array[i];

        return undefined;
    },

    displayDiagram: function (stepName) {
        var diagramData = mainWindow.getFromName(mainWindow.diagrams, stepName);

        var html = '<div class="container">';
        html += '<div class="row">';
        html += '<div class="col-sm">';
        html += '<div class="card" style="width: 18rem;">'

        html += '<div class="card-body">';
        html += '<h5 class="card-title">Diagram goes Here!</h5 >';
        html += mainWindow.slideInBackToStep();
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $('#mainwindow').html(html); 
    },

    slideInBackToStep: function () {
        var html = "</div>";
        html += '<div class="card-body">';
        html += "<button type='button' class='btn btn-primary' onclick=\"displayStep('" + mainWindow.currentStepName + "')\" > Back to Step</button > ";
        html += "</div>";
        html += '<div class="card-body">';
        return html; 
    },

    slideInJumpBoxes: function () {

        var html = "</div>";
        html += '<div class="card-body">';

        //jump to step
        html += '<div class="dropdown ">';
        html += '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
        html += 'Jump to Step';
        html += '</button>';
        html += '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">';
        html += mainWindow.steps.reduce(function (output, item) {
            return output += '<a class="dropdown-item" onClick=\"mainWindow.jumpToStep(\'' + item['name'] + '\')\" >' + item['name'] + '</a>';
        }, "");

        html += '</div>';
        html += '</div>';

        //jump to diagram
        html += '<div class="dropdown ">';
        html += '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
        html += 'Jump to Diagram';
        html += '</button>';
        html += '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">';
        html += mainWindow.steps.reduce(function (output, item) {
            return output += '<a class="dropdown-item" onClick=\"mainWindow.displayDiagram(\'' + item['name'] + '\')\" >' + item['name'] + '</a>';
        }, "");

        html += '</div>';
        html += '</div>';
        

        return html;

    },


    linkSteps: function (steps) {
        for (var i = 0; i < steps.length; i++) {
            $.extend(steps[i], i === 0 ? undefined : { previousStepName: steps[i - 1].name });
            $.extend(steps[i], i + 1 === steps.length ? undefined : { nextStepName: steps[i + 1].name });
        }
    },

    nextStep: function () {

        var currStep = mainWindow.getFromName(mainWindow.steps, mainWindow.currentStepName);

        console.log(currStep);

        console.log(currStep.nextStepName);

        if (currStep.nextStepName === undefined)
            return;

        mainWindow.jumpToStep(currStep.nextStepName);
    },

    previousStep: function () {
        var currStep = mainWindow.getFromName(mainWindow.steps, mainWindow.currentStepName);

        if (currStep.previousStepName === undefined)
            return;

        mainWindow.jumpToStep(currStep.previousStepName);
    },

    jumpToStep: function (name) {

        mainWindow.currentStepName = name;
        mainWindow.displayStep(mainWindow.currentStepName);

    },

    displayStep: function (name) {
        var stepData = mainWindow.getFromName(mainWindow.steps, name);

        var html = '<div class="container">';
        html += '<div class="row">';
        html += '<div class="col-sm">';
        html += '<div class="card" style="width: 18rem;">';

        if (stepData.alert !== undefined) {
            html += '<div class="card-header alert-danger">';
            html += stepData.alert;
            html += '</div>';
        }

        if (stepData.warning !== undefined) {
            html += '<div class="card-header alert-warning">';
            html += stepData.warning;
            html += '</div>';
        }

        html += '<div class="card-body">';
        html += '<h5 class="card-title">' + stepData.title + '</h5 >';


        html += stepData.text.reduce(function (output, item) { return output += '<p class="card-text">' + item + '</p>'; });
        html +=  mainWindow.slideInJumpBoxes();
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $('#mainwindow').html(html); 
        

    },

    keyhandler: function (event) {
        console.log(event);

        if (event.keyCode === 39)
            mainWindow.nextStep();
        else if (event.keyCode === 37)
            mainWindow.previousStep();
    }
    

    /*







    setup: function (role) {

        mainWindow.role = role;

        try {



            mainWindow.voiceControl.addCommand("maestro next step", mainWindow.nextStep);
            mainWindow.voiceControl.addCommand("maestro previous step", mainWindow.previousStep);

            mainWindow.voiceControl.start();
        }
        catch (e) {
            console.log(e);
        }
        

        mainWindow.render();
    },

    render: function () {
        console.log("Rendering step: " + mainWindow.step);
        $.get(mainWindow.role + "/" + mainWindow.step + ".html", function (data) {
            $('#mainwindow').html(data);
        });


    },




    */
};



$(document).ready(function () {


    mainWindow.init();


});

