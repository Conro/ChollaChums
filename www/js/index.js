/*
 * index.js
 * Put your JavaScript in here
 */

"use strict;"

//Page divs
var loginPageDiv = $('#loginPageDiv');
var signUpPageDiv = $('#signUpPageDiv'); 
var homePageDiv = $('#homePageDiv'); 

//Alert vars
var alertDangerClass = "alert alert-danger mx-auto d-block text-center";
var alertSuccessClass = "alert alert-success mx-auto d-block text-center";
var loginPageAlertDiv = $('#loginPageAlertDiv');
var signUpPageAlertDiv = $('#signUpPageAlertDiv');
var loginPageAlert = $('#loginPageAlert');
var signUpPageAlert = $('#signUpPageAlert')


/* wait until all phonegap/cordova is loaded then call onDeviceReady*/
document.addEventListener("deviceready", onDeviceReady, false);

//only for mobile
function onDeviceReady(){
    console.log("JS loaded, DOC READY");
}

/*====================*/
/* put functions here */
/*====================*/

function initMap() {
    var mapElement 		= document.getElementById('mapDiv');
    
    var geoLocationASU 	= {lat: 33.4166317, lng: -111.9341069};
    var mapOptions 		= {zoom: 18, center: geoLocationASU};

    var mapper = new google.maps.Map(mapElement, mapOptions);

    var markerOptions 	= {position: geoLocationASU, map: mapper};
    var marker = new google.maps.Marker(markerOptions);
}

$("#signUpButton").click(function (e) { 
    e.preventDefault();

    /*$.get("http://chollachumsapi.azurewebsites.net/users", function( data ) {
        console.log(data);
      });*/

    //Fade in/out
    $(loginPageDiv).fadeOut( "fast", function() {
        $(signUpPageDiv).fadeIn("fast");
        //Reset signUpForm
        $('#signUpForm')[0].reset();
        resetAlerts();
    });
});

$("#signUpBackButton").click(function (e) { 
    e.preventDefault();

    //Fade in/out
    $(signUpPageDiv).fadeOut( "fast", function() {
        resetLoginForm(true, true);
        resetAlerts();
        $(loginPageDiv).fadeIn("fast");
    });
});

$("#signUpForm").submit(function(e){

    console.log("signUpForm submitted");

    //testInsert(function(success, statusMsg){
        //console.log(success);
        //console.log(statusMsg);
    //});

    var pass = $('#passInputReg').val();
    var confPass = $('#passConfInputReg').val();
    

    e.preventDefault();
    
    if (pass === confPass){
        //Construct welcome string
        //var welcomeString = "<strong>Woot! Welcome " + username + "<br></strong> Your account was created, try logging in!";

        createAccount(function(success, statusMsg, newUser){
            
            if (success){
                $(signUpPageDiv).fadeOut( "fast", function() {
                    resetLoginForm(true, false);
                    $(loginPageDiv).fadeIn("fast");

                    //Create alert
                    createAlert('success', loginPageAlertDiv, loginPageAlert, statusMsg);

                    //Set username input value with newly created username
                    $('#userLoginInput').val(newUser); 
                });
            }
            else if(!success){
                createAlert('danger', signUpPageAlertDiv, signUpPageAlert, statusMsg);
            }
        });     
    }
    else {
        //Construct error string
        var warningString = "<strong>Oops!<br></strong>Passwords do no match!"; 

        //Create alert
        createAlert('danger', signUpPageAlertDiv, signUpPageAlert, warningString);
    }
});

//$("#loginButton").click(function (e) { 
$("#loginForm").submit(function (e) { 
    e.preventDefault();

    login(function(success, statusMsg){
        if(success) {
            $(loginPageDiv).slideUp( "slow", function() {
                $(homePageDiv).fadeIn("fast");
            });
        }
        else {
            
        }
    });
    //login(username, password, HelloWorld);

    //Fade in/out
    
});

$("#mapToLoginButton").click(function (e) { 
    e.preventDefault();

    //Fade in/out
    $(homePageDiv).fadeOut( "fast", function() {
        $(loginPageDiv).fadeIn("fast");
        resetAlerts();
    });

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
    //Reset login page alert
    $(loginPageAlert).html("");
    $(loginPageAlertDiv).hide();

    //Reset sign up page alert
    $(signUpPageAlert).html("");
    $(signUpPageAlertDiv).hide();

    //Reset red border around password inputs (when they don't match the border turns red)
    $('#passConfInputReg').css("border", "1px solid #8EBBA7");
    $('#passInputReg').css("border", "1px solid #8EBBA7")
}


function checkForm(formName){
    
    var canSubmit = true;

    //Get all the input elements in the form. Case changes depending on form
    if (formName === "loginForm") {
        var formElements = document.forms["loginForm"].getElementsByTagName("input");
        var button = $('#loginButton');
    }
    else if (formName === "signUpForm") {
        var formElements = document.forms["signUpForm"].getElementsByTagName("input");
        var button = $('#registerButton');
    }
    
    //Loop through the input elements and make sure they have values.
    //If one of them has a 0 length then the login button is disabled
    for (var i = 0; i < formElements.length; i++) {
        if (formElements[i].value.length == 0) {
            canSubmit = false;
        }
    }

    if (canSubmit) {
        $(button).prop('disabled', false);
    }
    else {
        $(button).prop('disabled', true);
    }
}

function resetLoginForm(user, pass) {
    if (user){
        $('#userLoginInput').val("");
    }
    if (pass){
        $('#passwordLoginInput').val("");
    }
}

function createAlert(type, pdiv, div, msg) {

    var alertClass = "alert alert-" + type + " mx-auto d-block text-center";

    //Add appropriate styles and msg to alert
    $(div).addClass(alertClass);
    $(div).html(msg);

    //Show the alert
    $(pdiv).fadeIn("fast");
}