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

    //Fade in/out
    $('#loginPageDiv').fadeOut( "fast", function() {
        $('#signUpPageDiv').fadeIn("fast");
        //Reset signUpForm
        $('#signUpForm')[0].reset();
        resetAlerts();
    });
});

$("#signUpBackButton").click(function (e) { 
    e.preventDefault();

    //Fade in/out
    $('#signUpPageDiv').fadeOut( "fast", function() {
        $('#loginPageDiv').fadeIn("fast");
        resetAlerts();
    });
});

$("#signUpForm").submit(function(e){

    console.log("signUpForm submitted");
    var name = $('#nameInputReg').val();
    var username = $('#usernameInputReg').val();
    var email = $('#emailInputReg').val();
    var uni = $('#universitySelectInputReg').val();
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
            $('#regSuccessAlert').html(welcomeString);
            $('#userLogin').val(username);
            $('#regSuccessAlertDiv').fadeIn("fast");
        });
    }
    else {
        var warningString = "<strong>Oops!<br></strong>Passwords do no match!";  
        $('#regWarningAlert').html(warningString);   
        $('#regWarningAlertDiv').fadeIn("fast");   
    }
});

$("#loginButton").click(function (e) { 
    e.preventDefault();

    //Fade in/out
    $('#loginPageDiv').fadeOut( "fast", function() {
        $('#homePageDiv').fadeIn("fast");
    });

});

$("#mapToLoginButton").click(function (e) { 
    e.preventDefault();

    //Fade in/out
    $('#homePageDiv').fadeOut( "fast", function() {
        $('#loginPageDiv').fadeIn("fast");
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
    $('#regWarningAlert').html("");
    $('#regWarningAlertDiv').hide();

    $('#regSuccessAlert').html("");
    $('#regSuccessAlertDiv').hide();
}