var mainWindow = {

    //urlprefix: "http://54.242.219.254:3000",
    urlprefix: "",

    steps: [],
    images: [],
    imagePages: [],
    currentStepName: undefined,
    currentImagePage: 0,
    voiceControl: undefined,
    currentProcedure : undefined,

    mission: [],
    roles: [],

    init: function () {
        console.log(mainWindow.urlprefix + "/hud/api/getFiles");
        $.get({
            url: mainWindow.urlprefix + "/hud/api/getFiles",
            dataType : "JSON"
        })
            .fail(function (error) {
                console.log(error);
                alert("Failed to download mission data");
                console.log("herE");

            })
            .done(function (data) {
                mainWindow.mission = data;
                mainWindow.selectProcedure();
            });

        mainWindow.voiceControl = new anycontrol();

        mainWindow.voiceControl.addCommand("maestro next step", mainWindow.nextStep);
        mainWindow.voiceControl.addCommand("maestro previous step", mainWindow.previousStep);
        mainWindow.voiceControl.addCommand("maestro go home", mainWindow.selectProcedure);
        mainWindow.voiceControl.addCommand("maestro back to step", mainWindow.displayDefault);
        mainWindow.voiceControl.addCommand("maestro next image page", mainWindow.nextImagePage);
        mainWindow.voiceControl.addCommand("maestro previous image page", mainWindow.previousImagePage);
        mainWindow.voiceControl.addCommand("maestro show image ${thing}", mainWindow.showImage);
        mainWindow.voiceControl.addCommand("maestro select procedure ${procedureNumber}", mainWindow.downloadRoles);
        mainWindow.voiceControl.addCommand("maestro select role ${roleNumber}", mainWindow.downloadSteps);
        mainWindow.voiceControl.addCommand("maestro select roll ${roleNumber}", mainWindow.downloadSteps);
        mainWindow.voiceControl.addCommand("maestro select troll ${roleNumber}", mainWindow.downloadSteps);
        mainWindow.voiceControl.addCommand("maestro select row ${roleNumber}", mainWindow.downloadSteps);
        mainWindow.voiceControl.addCommand("maestro toggle checkbox ${checkboxNumber}", mainWindow.toggleCheckbox);
        mainWindow.voiceControl.addCommand("maestro toggle check box ${checkboxNumber}", mainWindow.toggleCheckbox);
        mainWindow.voiceControl.addCommand("maestro help", mainWindow.displayHelp);

        try {
            mainWindow.voiceControl.start();
        }
        catch (e) { ; }
        mainWindow.voiceControl.DEBUG = true;

    },

    wordToNumber: function (input) {
        if (input === "one" || input === "1")
            return 1;
        else if (input === "to" || input === "too" || input === "two" || input === "2")
            return 2;
        else if (input === "three" || input === "3" || input === "tree")
            return 3;
        else if (input === "four" || input === "for" || input === "4")
            return 4;
        else if (input === "five" )
            return 5;
        else if (input === "six" || input === "sex" || input === "sick")
            return 6;
    },


    showImage: function (input) {
        var word = input.thing;
        var number = mainWindow.wordToNumber(word);
        if (number !== 4)
            mainWindow.displayImage(mainWindow.imagePages[mainWindow.currentImagePage][number]);
        else
            mainWindow.displayImage(mainWindow.imagePages[mainWindow.currentImagePage][0]);
    },


    selectProcedure: function () {
        if (mainWindow.mission === undefined)
            return;

        var html = '<div class="container">';
        html += '<div class="card">';
        html += '<div class="cardbody">';
        html += '<h5 class="card-title">Procedure Select</h5>';
        html += ' <p class="card-text">Please say &quot;maestro select procedure&quot; and the procedure number to continue</p >';

        for (var i = 0; i < mainWindow.mission.length; i++)
            html += '<p>Procedure ' + ( i + 1 )+ ' : ' + mainWindow.mission[i] + '</p>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $('#mainwindow').html(html);
    },

    downloadRoles: function (voiceInput) {
        if (mainWindow.mission === undefined)
            return;

        var word = voiceInput.procedureNumber;
        var number = mainWindow.wordToNumber(word);
        mainWindow.currentProcedure = mainWindow.mission[number - 1];

        $.get({
            url : mainWindow.urlprefix + "/hud/api/roles/" + mainWindow.currentProcedure,
            dataType: "JSON"
        })
            .fail(function (error) {
                console.log(error);
                mainWindow.displayError("Failed to download role data");
            })
            .done(function (data) {
                mainWindow.roles = data;
                mainWindow.selectRole();
            });
    },

    selectRole: function () {

        if (mainWindow.roles === undefined || mainWindow.roles.length === 0)
            return;

        var html = '<div class="container">';
        html += '<div class="card">';
        html += '<div class="cardbody">';
        html += '<h5 class="card-title">Role Select</h5>';
        html += ' <p class="card-text">Please say &quot;maestro select role&quot; and the role number to continue</p >';

        for (var i = 0; i < mainWindow.roles.length; i++)
            html += '<p>Role ' + (i + 1) + ' : ' + mainWindow.roles[i] + '</p>';

        html += '</div>';
        html += '</div>';
        html += '</div>';
        $('#mainwindow').html(html);
    },

    downloadSteps: function (voiceInput) {

        if (mainWindow.roles === undefined || mainWindow.roles.length === 0 || mainWindow.mission === undefined || mainWindow.currentProcedure === undefined)
            return;

        var roleNumber = mainWindow.wordToNumber(voiceInput.roleNumber);
        var roleName = mainWindow.roles[roleNumber - 1];
        var stepurl = mainWindow.urlprefix + "/hud/api/tasks/" + mainWindow.currentProcedure + "/" + roleName;
        $.get({
            url: stepurl,
            dataType: "JSON"
        })
            .fail(function (error) {
                console.log(error);
                mainWindow.displayError("Failed to download step data");
            })
            .done(function (data) {
                mainWindow.start(data);
            });


    },

    start: function (data) {

        if (data.steps.length === 0) {
            mainWindow.displayError("No steps available for this role");
            return;
        }


        mainWindow.steps = [];
        mainWindow.images = [];
        mainWindow.imagePages = [];

        mainWindow.currentStepName = undefined;
        mainWindow.currentImagePage = 0;


        console.log(data);
        mainWindow.images = data.images;
        mainWindow.steps = data.steps;




        mainWindow.linkSteps(mainWindow.steps);
        mainWindow.splitImagesIntoPages();

        mainWindow.currentStepName = mainWindow.steps[0].name;
        mainWindow.display(mainWindow.currentStepName);
        $(document).keyup(mainWindow.keyhandler);
    },

    getProcedure: function (procedureName) {
        return mainWindow.getFromName(mainWindow.mission, procedureName);
    },


    getFromName: function (array, nameOfThing) {
        for (var i = 0; i < array.length; i++)
            if (array[i].name === nameOfThing)
                return array[i];

        return undefined;
    },

    displayHelp: function () {
        var html = '<div class="container-fuild">';
        html += '<div class="card">';
        html += '<div class="card-body">';
        html += '<h5 class="card-title">NASA HUD Voice Command</h5 >';
        html += '<p class="card-text">maestro next step</p>';
        html += '<p class="card-text">maestro previous step</p>';
        html += '<p class="card-text">maestro go home</p>';
        html += '<p class="card-text">maestro back to step</p>';
        html += '<p class="card-text">maestro next image page</p>';
        html += '<p class="card-text">maestro previous image page</p>';
        html += '<p class="card-text">maestro show image #</p>';
        html += '<p class="card-text">maestro select procedure #</p>';
        html += '<p class="card-text">maestro select role #</p>';
        html += '<p class="card-text">maestro toggle checkbox #</p>';
        html += '<p class="card-text">maestro help</p>';

        html += '</div>';
        html += '</div>';
        html += '</div>';
        $('#mainwindow').html(html);
    },


    displayImage: function (imageUrl) {

        var html = '<div class="container-fuild">';
        html += '<img src="' + imageUrl + '" class="img-fluid" width="100%" alt="...">'
        html += '</div>';
        $('#mainwindow').html(html);
    },

    slideInCheckboxes: function(stepData) {

        if (stepData.checkboxes === undefined)
            return "";

        var html = "";

        html += '<div class="card-body">';
        html += stepData.checkboxes.reduce(function (output, item, idx) {
            var uid = stepData.stepNumber + '_' + idx;
            output += '<div class="form-check">';
            output += '<input type="checkbox" class="form-check-input" id="' + uid + '">';
            output += '<label class="form-check-label" for="' + uid + '">' + item + '</label>';
            output += '</div>';

            return output;
        }, "");
        html += "</div>";
        return html;
    },

    


    linkSteps: function (steps) {
        for (var i = 0; i < steps.length; i++)
            $.extend(steps[i], { name: "step_" + i });
        for (var i = 0; i < steps.length; i++) {
            $.extend(steps[i], i === 0 ? undefined : { previousStepName: steps[i - 1].name });
            $.extend(steps[i], i + 1 === steps.length ? undefined : { nextStepName: steps[i + 1].name });
            $.extend(steps[i], { stepNumber : i });

        }
    },

    splitImagesIntoPages: function () {

        var currPage = ["","","",""];



        for (var i = 1; i <= mainWindow.images.length; i++) {

            var currentImage = mainWindow.images[i - 1];

            var mod = i % 4;
            currPage[mod] = currentImage;      

            if (mod === 0) {
                mainWindow.imagePages.push(currPage);
                currPage = ["", "", "", ""];
            }
        }
        if (mainWindow.images.length % 4 !== 0)
            mainWindow.imagePages.push(currPage);
    },


    nextStep: function () {

        if (mainWindow.steps === undefined || mainWindow.steps.length === 0)
            return;

        var currStep = mainWindow.getFromName(mainWindow.steps, mainWindow.currentStepName);

        console.log(currStep);

        console.log(currStep.nextStepName);

        if (currStep.nextStepName === undefined)
            mainWindow.display();

        mainWindow.jumpToStep(currStep.nextStepName);
    },

    previousStep: function () {

        if (mainWindow.steps === undefined || mainWindow.steps.length === 0)
            return;

        var currStep = mainWindow.getFromName(mainWindow.steps, mainWindow.currentStepName);

        if (currStep.previousStepName === undefined)
            return;


        mainWindow.jumpToStep(currStep.previousStepName);
    },

    jumpToStep: function (name) {

        mainWindow.currentStepName = name;
        mainWindow.display(mainWindow.currentStepName);

    },

    nextImagePage: function () {
        if (mainWindow.imagePages.length === 0)
            return;

        if (mainWindow.currentImagePage < mainWindow.imagePages.length)
            mainWindow.currentImagePage++;

        mainWindow.display(mainWindow.currentStepName);

    },

    previousImagePage: function () {

        if (mainWindow.imagePages.length === 0)
            return;

        if (mainWindow.currentImagePage > 0)
            mainWindow.currentImagePage--;


            mainWindow.display(mainWindow.currentStepName);

    },

    displayDefault: function () {
        mainWindow.display(mainWindow.currentStepName);
    },

    display: function (stepName) {
        if (mainWindow.steps === undefined || mainWindow.steps.length === 0)
            return;

        var html = '<div class="container-fuild">';
        html += '<div class="row" style="margin-right:0px">';

        html += '<div class="col">';

        //final step stuff
        if (stepName === undefined)
            html += mainWindow.displayFinalStep();
        else
            html += mainWindow.displayStep(stepName);
        html += '</div>';
        html += '</div>';
        html += '<div class="row" style="margin-right:0px">';
        html += '<div class="col">';

        html += mainWindow.displayImageThumbnails();
        html += '</div>';
        html += '</div>';
        console.log(html);
        $('#mainwindow').html(html);
    },


    displayStep: function (name) {
        var stepData = mainWindow.getFromName(mainWindow.steps, name);

        var html = '<div class="card">';

        if (stepData.warning.length > 0) {
            html += '<div class="card-header alert-danger">';
            html += stepData.warning;
            html += '</div>';
        }

        if (stepData.caution.length > 0) {
            html += '<div class="card-header alert-warning">';
            html += stepData.caution;
            html += '</div>';
        }

        html += '<div class="card-body">';
        html += '<h5 class="card-title">' + stepData.title + '</h5 >';

        if (stepData.duration.length > 0)
            html += '<h4 class="card-title">Duration' + stepData.duration + '</h4 >';

        if (stepData.text.length > 0) {
            var shrink = stepData.text.length > 8;

            html += stepData.text.reduce(function (output, item) {
                var o = '<div class="card-text" ';
                if (shrink)
                    o += 'style="font-size:50%"';

                return output + o + '>' + item + '</div>';
            });
        }
        html += mainWindow.slideInCheckboxes(stepData);
        html += '</div>';
        html += '</div>';

        return html;
    },




    displayFinalStep: function () {
        var html = '<div class="card">';
        html += '<div class="card-body">';
        html += '<h5 class="card-title">Procedure Complete</h5 >';
        html += '</div>'; 
        html += '</div>';
        window.setTimeout(mainWindow.selectProcedure, 5000);
        return html;
    },






    displayImageThumbnails() {

        var html = '<div class="card">';

        if (mainWindow.currentImagePage < 0 || mainWindow.currentImagePage === mainWindow.imagePages.length) {

            html += '<div class="card-body">';
            html += 'There are no other images';
            html += '</div>';
        }
        else {

        
            html += '<div class="row">';
            html += '<div class="col">';
            if (mainWindow.imagePages[mainWindow.currentImagePage][1] !== "") {
                html += '<div>1</div>';
                html += '<img src="' + mainWindow.imagePages[mainWindow.currentImagePage][1] + '" class="img-fluid mb-4" alt="">';
            }
            html += '</div>';
            html += '<div class="col">';
            if (mainWindow.imagePages[mainWindow.currentImagePage][2] !== "") {
                html += '<div>2</div>';
                html += '<img src="' + mainWindow.imagePages[mainWindow.currentImagePage][2] + '" class="img-fluid mb-4" alt="">';
            }
            html += '</div>';
            html += '<div class="col">';
            if (mainWindow.imagePages[mainWindow.currentImagePage][3] !== "") {
                html += '<div>3</div>';
                html += '<img src="' + mainWindow.imagePages[mainWindow.currentImagePage][3] + '" class="img-fluid mb-4" alt="">';
            }
            html += '</div>';
            html += '<div class="col">';
            if (mainWindow.imagePages[mainWindow.currentImagePage][0] !== "") {
                html += '<div>4</div>';
                html += '<img src="' + mainWindow.imagePages[mainWindow.currentImagePage][0] + '" class="img-fluid mb-4" alt="">';
            }
            html += '</div>';
            html += '</div>';
        }
        html += '</div>';
        return html;
    },




    keyhandler: function (event) {
        console.log(event);

        if (event.keyCode === 39)
            mainWindow.nextStep();
        else if (event.keyCode === 37)
            mainWindow.previousStep();
    },

    toggleCheckbox: function (voiceInput) {

        var stepData = mainWindow.getFromName(mainWindow.steps, mainWindow.currentStepName);

        var checkboxNumber = mainWindow.wordToNumber(voiceInput.checkboxNumber) - 1;

        var checkbox = $('#' + stepData.stepNumber + "_" + checkboxNumber);
        checkbox.prop("checked", !checkbox.prop("checked"));
    },

    displayError: function (message) {

        var html = '<div class="container-fuild">';
        html += '<div class="row" style="margin-right:0px">';

        html += '<div class="col">';
            html += '<div class="card">';
            html += '<div class="card-body">';
            html += '<h5 class="card-title alert-danger" >Error</h5 >';
            html += '<div class="card-text">' + message + '</div>';
            html += '<div class="card-text">Please say &quotMaestro go home&quot to start over.</div>';
            html += '</div>';
            html += '</div>';
        html += '</div>';
        html += '</div>';
     
            html += '</div>';
            html += '</div>';
        console.log(html);
        $('#mainwindow').html(html);
    }
};




$(document).ready(function () {


    mainWindow.init();


});

