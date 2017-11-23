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
        $(loginPageDiv).fadeIn("fast");
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
        //Construct welcome string
        var welcomeString = "<strong>Woot! Welcome " + username + "<br></strong> Your account was created, try logging in!";
        
        $(signUpPageDiv).fadeOut( "fast", function() {
            $(loginPageDiv).fadeIn("fast");

            //Add appropriate styles and msg to alert
            $(loginPageAlert).addClass(alertSuccessClass)
            $(loginPageAlert).html(welcomeString);

            //Set username input value with newly created username
            $('#userLoginInput').val(username);

            //Show the alert
            $(loginPageAlertDiv).fadeIn("fast");
        });
    }
    else {
        //Construct error string
        var warningString = "<strong>Oops!<br></strong>Passwords do no match!"; 
        
        //Add appropriate styles and msg to alert
        $(signUpPageAlert).addClass(alertDangerClass)
        $(signUpPageAlert).html(warningString);

        $('#passConfInputReg').css("border", "1px solid red");
        $('#passInputReg').css("border", "1px solid red")
   
        $(signUpPageAlertDiv).fadeIn("fast");   
    }
});

$("#loginButton").click(function (e) { 
    e.preventDefault();

    var username = "";
    var password = "";

    username = $('#userLoginInput').val();
    password = $('#passwordLoginInput').val();

    login(username, password, function(success, statusMsg){
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