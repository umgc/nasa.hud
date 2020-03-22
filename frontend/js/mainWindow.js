var mainWindow = {

    steps: [],
    images: [],
    imagePages: [],
    currentStepName: undefined,
    currentImagePage: 0,
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

       mainWindow.voiceControl.addCommand("next step", mainWindow.nextStep);
        mainWindow.voiceControl.addCommand("previous step", mainWindow.previousStep);
        mainWindow.voiceControl.addCommand("go home", mainWindow.selectProcedure);
        mainWindow.voiceControl.addCommand("back to step", mainWindow.displayDefault);
        mainWindow.voiceControl.addCommand("next image page", mainWindow.nextImagePage);
        mainWindow.voiceControl.addCommand("previous image page", mainWindow.previousImagePage);
        mainWindow.voiceControl.addCommand("show image ${thing}", mainWindow.showImage);


        try {
            mainWindow.voiceControl.start();
        }
        catch (e) { ; }

    },

    showImage: function (input) {
        var thing = input.thing;
        if (thing === "one" || thing === "1")
            mainWindow.showImage1();
        else if (thing === "to" || thing === "too" || thing === "two" || thing === "2")
            mainWindow.showImage2();
        else if (thing === "three" || thing === "3" || thing === "tree")
            mainWindow.showImage3();
        else if (thing === "four" || thing === "for" || thing === "4" )
            mainWindow.showImage4();
    },


    selectProcedure: function () {


        var html = '<div class="container">';
        html += '<div class="card">';
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
        html += '<div class="card">';
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
                console.log(error);
                alert("Could not download steps");

            })
            .done(mainWindow.start);

    },

    start: function (data) {

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

    showImage1: function () {
        mainWindow.displayImage(mainWindow.imagePages[mainWindow.currentImagePage][1].name);
    },
    showImage2: function () {
        mainWindow.displayImage(mainWindow.imagePages[mainWindow.currentImagePage][2].name);
    },
    showImage3: function () {
        mainWindow.displayImage(mainWindow.imagePages[mainWindow.currentImagePage][3].name);
    },
    showImage4: function () {
        mainWindow.displayImage(mainWindow.imagePages[mainWindow.currentImagePage][0].name);
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
            mainWindow.display();


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
            if (mainWindow.imagePages[mainWindow.currentImagePage][3] !== "") {
                html += '<div>3</div>';
                html += '<img src="' + mainWindow.imagePages[mainWindow.currentImagePage][3].url + '" class="img-fluid mb-4" alt="">';
            }
            html += '</div>';
            html += '<div class="col">';
            if (mainWindow.imagePages[mainWindow.currentImagePage][2] !== "") {
                html += '<div>2</div>';
                html += '<img src="' + mainWindow.imagePages[mainWindow.currentImagePage][2].url + '" class="img-fluid mb-4" alt="">';
            }
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

