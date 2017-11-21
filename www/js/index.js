/*
 * index.js
 * Put your JavaScript in here
 */

"use strict;"

/*===========================*/
/* put global variables here */
/*===========================*/


/* wait until all phonegap/cordova is loaded then call onDeviceReady*/
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	console.log("JS loaded, DOC READY");
}

/*====================*/
/* put functions here */
/*====================*/

$("#signUpButton").click(function (e) { 
    e.preventDefault();

    //Fade in/out
    $('#loginPageDiv').fadeOut( "fast", function() {
        $('#signUpPageDiv').fadeIn("fast");
        //Reset signUpForm
        $('#signUpForm')[0].reset();
        resetAlerts();
    });

    /*$('#loginPageDiv').hide(function(){
        $('#loginPageDiv').fadeOut("fast");
    }); 
    $('#signUpPageDiv').show();*/

});

$("#signUpBackButton").click(function (e) { 
    e.preventDefault();

    //Fade in/out
    $('#signUpPageDiv').fadeOut( "fast", function() {
        $('#loginPageDiv').fadeIn("fast");
        resetAlerts();
    });

    //$('#loginPageDiv').show(); 
    //$('#signUpPageDiv').hide(); 
});

$("#signUpForm").submit(function(e){

    console.log("signUpForm submitted");
    var name = $('#nameInput').val();
    var username = $('#usernameInputReg').val();
    var email = $('#emailInput').val();
    var uni = $('#universitySelectInput').val();
    var pass = $('#passInputReg').val();
    var confPass = $('#passConfInputReg').val();
    console.log(name);
    console.log(username);
    console.log(email);
    console.log(uni);
    console.log(pass);
    console.log(confPass);
    e.preventDefault();

    if (pass === confPass){
        var welcomeString = "<strong>Woot! Welcome " + username + "<br></strong> Your account was created, try logging in!";
        
        $('#signUpPageDiv').fadeOut( "fast", function() {
            $('#loginPageDiv').fadeIn("fast");
            $('#regSuccessAlert').html(welcomeString)
            $('#regSuccessAlertDiv').fadeIn("fast");
        });
    }
    else {
        var warningString = "<strong>Oops!<br></strong>Passwords do no match!";  
        $('#regWarningAlert').html(warningString)   
        $('#regWarningAlertDiv').fadeIn("fast");   
    }
    /*
    var welcomeString = "<strong>Woot! Welcome " + username + "<br></strong> Your account was created, try logging in!";

    $('#signUpPageDiv').fadeOut( "fast", function() {
        $('#loginPageDiv').fadeIn("fast");
        $('#regSuccessAlert').html(welcomeString)
        $('#regSuccessDiv').fadeIn("fast");
    });*/
});

/*$("#registerButton").click(function (e) { 
    $("#signUpForm").submit()
    //e.preventDefault();


    /*console.log("outPutRegistrationInfo called");
    var name = $('#nameInput').val();
    var username = $('#usernameInputReg').val();
    var email = $('#emailInput').val();
    var uni = $('#universitySelectInput').val();
    var pass = $('#passInputReg').val();
    var confPass = $('#passConfInputReg').val();
    console.log(name);
    console.log(username);
    console.log(email);
    console.log(uni);
    console.log(pass);
    console.log(confPass);
    e.preventDefault();
    $('#loginPageDiv').show(); 
    $('#signUpPageDiv').hide(); 
});*/

function resetAlerts() {
    $('#regWarningAlert').html("");
    $('#regWarningAlertDiv').hide();

    $('#regSuccessAlert').html("");
    $('#regSuccessAlertDiv').hide();
}