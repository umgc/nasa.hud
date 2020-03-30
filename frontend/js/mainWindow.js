var mainWindow = {

    steps: [],
    images: [],
    imagePages: [],
    currentStepName: undefined,
    currentImagePage: 0,
    voiceControl: undefined,
    currentProcedure : undefined,

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

        mainWindow.voiceControl.addCommand("maestro next step", mainWindow.nextStep);
        mainWindow.voiceControl.addCommand("maestro previous step", mainWindow.previousStep);
        mainWindow.voiceControl.addCommand("maestro go home", mainWindow.selectProcedure);
        mainWindow.voiceControl.addCommand("maestro back to step", mainWindow.displayDefault);
        mainWindow.voiceControl.addCommand("maestro next image page", mainWindow.nextImagePage);
        mainWindow.voiceControl.addCommand("maestro previous image page", mainWindow.previousImagePage);
        mainWindow.voiceControl.addCommand("maestro show image ${thing}", mainWindow.showImage);
        mainWindow.voiceControl.addCommand("maestro select procedure ${procedureNumber}", mainWindow.selectRole);
        mainWindow.voiceControl.addCommand("maestro select role ${roleNumber}", mainWindow.downloadSteps);
        mainWindow.voiceControl.addCommand("maestro select roll ${roleNumber}", mainWindow.downloadSteps);
        mainWindow.voiceControl.addCommand("maestro select troll ${roleNumber}", mainWindow.downloadSteps);
        mainWindow.voiceControl.addCommand("maestro select row ${roleNumber}", mainWindow.downloadSteps);

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
            mainWindow.displayImage(mainWindow.imagePages[mainWindow.currentImagePage][number].name);
        else
            mainWindow.displayImage(mainWindow.imagePages[mainWindow.currentImagePage][0].name);
    },


    selectProcedure: function () {
        
        var html = '<div class="container">';
        html += '<div class="card">';
        html += '<div class="cardbody">';
        html += '<h5 class="card-title">Procedure Select</h5>';
        html += ' <p class="card-text">Please say &quot;maestro select procedure&quot; and the procedure number to continue</p >';

        for (var i = 0; i < mainWindow.mission.length; i++)
            html += '<p>Procedure ' + ( i + 1 )+ ' : ' + mainWindow.mission[i].name + '</p>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $('#mainwindow').html(html);
    },

    selectRole: function (voiceInput) {

        var word = voiceInput.procedureNumber;
        var number = mainWindow.wordToNumber(word);

        mainWindow.currentProcedure = mainWindow.mission[number - 1];
        var html = '<div class="container">';
        html += '<div class="card">';
        html += '<div class="cardbody">';
        html += '<h5 class="card-title">Role Select</h5>';
        html += ' <p class="card-text">Please say &quot;maestro select role&quot; and the role number to continue</p >';

        for (var i = 0; i < mainWindow.currentProcedure.roles.length; i++)
            html += '<p>Role ' + (i + 1) + ' : ' + mainWindow.currentProcedure.roles[i] + '</p>';

        html += '</div>';
        html += '</div>';
        html += '</div>';
        $('#mainwindow').html(html);
    },

    downloadSteps: function (voiceInput) {
        var roleNumber = mainWindow.wordToNumber(voiceInput.roleNumber);
        var roleName = mainWindow.currentProcedure.roles[roleNumber - 1];

        var url = mainWindow.currentProcedure.name + "/" + roleName + ".json";
        console.log("url>" + url);
        $.get(url)
            .fail(function (error) {
                console.log(error);
                alert("Could not download steps");

            })
            .done(mainWindow.start);

    },

    start: function (data) {

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

    displayImage: function (stepName) {
        var imageData  = mainWindow.getFromName(mainWindow.images, stepName);

        var html = '<div class="container-fuild">';
        html += '<img src="' + imageData.url + '" class="img-fluid" alt="...">'
        html += "</br>";
        html += mainWindow.slideInBackToStep();
        html += '</div>';
        $('#mainwindow').html(html);
    },

    slideInCheckboxes: function(stepData) {

        if (stepData.checkboxes === undefined)
            return "";
        var html = "</div>";
        html += '<div class="card-body">';
        html += stepData.checkboxes.reduce(function (output, item, idx) {
            var uid = stepData.stepNumber + '_' + idx;
            output += '<div class="form-check">';
            output += '<input type="checkbox" class="form-check-input" id="' + uid + '">';
            output += '<label class="form-check-label" for="' + uid + '">' + item + '</label>';
            output += '</div>';

            return output;
        }, "");

        return html;
    },

    slideInBackToStep: function () {
        var html = "</div>";
        html += '<div class="card-body">';

        html += "<button type='button' class='btn btn-secondary' onclick=\"mainWindow.display('" + mainWindow.currentStepName + "')\" > Back to Step</button > ";
        html += "</div>";
        html += '<div class="card-body">';
        return html; 
    },

    


    linkSteps: function (steps) {
        for (var i = 0; i < steps.length; i++) {
            $.extend(steps[i], i === 0 ? undefined : { previousStepName: steps[i - 1].name });
            $.extend(steps[i], i + 1 === steps.length ? undefined : { nextStepName: steps[i + 1].name });
            $.extend(steps[i], { stepNunmber : i });

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

        var currStep = mainWindow.getFromName(mainWindow.steps, mainWindow.currentStepName);

        console.log(currStep);

        console.log(currStep.nextStepName);

        if (currStep.nextStepName === undefined)
            mainWindow.display();

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
        mainWindow.display(mainWindow.currentStepName);

    },

    nextImagePage: function () {

        if (mainWindow.currentImagePage < mainWindow.imagePages.length)
            mainWindow.currentImagePage++;

        mainWindow.display(mainWindow.currentStepName);

    },

    previousImagePage: function () {

        if (mainWindow.currentImagePage > 0)
            mainWindow.currentImagePage--;


            mainWindow.display(mainWindow.currentStepName);

    },

    displayDefault: function () {
        mainWindow.display(mainWindow.currentStepName);
    },

    display: function (stepName) {
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

        if (stepData.danger !== undefined) {
            html += '<div class="card-header alert-danger">';
            html += stepData.danger;
            html += '</div>';
        }

        if (stepData.alert !== undefined) {
            html += '<div class="card-header alert-warning">';
            html += stepData.alert;
            html += '</div>';
        }

        html += '<div class="card-body">';
        html += '<h5 class="card-title">' + stepData.title + '</h5 >';


        html += stepData.text.reduce(function (output, item) { return output += '<p class="card-text">' + item + '</p>'; });
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
                html += '<img src="' + mainWindow.imagePages[mainWindow.currentImagePage][1].url + '" class="img-fluid mb-4" alt="">';
            }
            html += '</div>';
            html += '<div class="col">';
            if (mainWindow.imagePages[mainWindow.currentImagePage][2] !== "") {
                html += '<div>2</div>';
                html += '<img src="' + mainWindow.imagePages[mainWindow.currentImagePage][2].url + '" class="img-fluid mb-4" alt="">';
            }
            html += '</div>';
            html += '<div class="col">';
            if (mainWindow.imagePages[mainWindow.currentImagePage][3] !== "") {
                html += '<div>3</div>';
                html += '<img src="' + mainWindow.imagePages[mainWindow.currentImagePage][3].url + '" class="img-fluid mb-4" alt="">';
            }
            html += '</div>';
            html += '<div class="col">';
            if (mainWindow.imagePages[mainWindow.currentImagePage][0] !== "") {
                html += '<div>4</div>';
                html += '<img src="' + mainWindow.imagePages[mainWindow.currentImagePage][0].url + '" class="img-fluid mb-4" alt="">';
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

