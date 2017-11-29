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

var mapScriptCreated = false;
var mapElement = undefined;
var markers = [];
var neighborhoods = [];
var curLatLng = undefined;

//Home page vars
var buttonHeaderLeft = $('#buttonHeaderLeft');
var buttonHeaderRight = $('#buttonHeaderRight');
var buttonHeaderLeftIcon = $('#buttonHeaderLeftIcon');
var buttonHeaderRightIcon = $('#buttonHeaderRightIcon');
var mapViewDiv = $('#mapViewDiv');
var listViewDiv = $('#listViewDiv');
var searchViewDiv = $('#searchViewDiv');


/* wait until all phonegap/cordova is loaded then call onDeviceReady*/
document.addEventListener("deviceready", onDeviceReady, false);

//only for mobile
function onDeviceReady(){
    console.log("JS loaded, DOC READY");
}


$( document ).ready(function() {
    console.log("DOC READY");
    mapElement = document.getElementById('mapViewDiv');
    var map = undefined;
    $('#userLoginInput').focus();

    neighborhoods = [
        {lat: 33.4166317, lng: -111.9341069, title: "WPC"},
        {lat: 33.416989, lng: -111.933010, title: "WPC McCord"},
        {lat: 33.416211, lng: -111.938084, title: "Gammage"},
        {lat: 33.415487, lng: -111.931947, title: "ASU Gym"}
      ];
});

/*====================*/
/* put functions here */
/*====================*/

function drop() {
    clearMarkers();
    console.log(neighborhoods);
    for (var i = 0; i < neighborhoods.length; i++) {
        addMarkerWithTimeout(neighborhoods[i], i * 200);
    }
}

function addMarkerWithTimeout(location, timeout) {
    var position = {lat: location.lat, lng: location.lng};
    var title = location.title
    var content = title;
    var infowindow = new google.maps.InfoWindow()


    /*
    console.log("What was passed through the loop: ");
    console.log(location);
    console.log("Position created with parameter coords: ");
    console.log(position);
    console.log(title);*/
    

    window.setTimeout(function() {

        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title,
            animation: google.maps.Animation.DROP
        });

        markers.push(marker);
    
        google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
            return function() {
               infowindow.setContent(content);
               infowindow.open(map,marker);
            };
        })(marker,content,infowindow)); 

    }, timeout);




}

  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }

function initMap() {
    
    //replace this with current location
    //var geoLocationASU 	= {lat: 33.4166317, lng: -111.9341069};

        console.log(curLatLng);

    navigator.geolocation.getCurrentPosition(geolocationSuccess,
        geolocationError,
        { enableHighAccuracy: true });



    map = new google.maps.Map(mapElement, {
        zoom: 15,
        center: curLatLng
    });

    //var mapOptions 		= {zoom: 18, center: geoLocationASU};

    //var mapper = new google.maps.Map(mapElement, mapOptions);

    //var markerOptions 	= {position: geoLocationASU, map: mapper};
    //var marker = new google.maps.Marker(markerOptions);
}

function loadMapScript(callback) {
	var script 		 = undefined;
	var googleAPIKey = "AIzaSyBsGwlbU1AZYpGBwio6ll1kiwknKSuUIVk";
	var googleAPIUrl = "https://maps.googleapis.com/maps/api/js";

	var srcURL 		 = googleAPIUrl + '?key=' + googleAPIKey 
							+ '&callback=' + callback;

	script 			 = document.createElement('script');
	script.type 	 = "text/javascript";
	script.async 	 = true;
	script.defer 	 = true;
    script.src 		 = srcURL;

    document.body.appendChild(script);
    mapScriptCreated = true;
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
    resetAlerts();
/*
    $(loginPageDiv).slideUp( "slow", function() {
        $(homePageDiv).fadeIn("fast");
        if(!mapScriptCreated){
            loadMapScript('initMap');
        }
    });*/
    

    
    login(function(success, statusMsg){
        if(success) {
            $(loginPageDiv).slideUp( "slow", function() {
                $("#exploreButton").click();
                $(homePageDiv).fadeIn("fast");
                if(!mapScriptCreated){
                    loadMapScript('initMap');
                }
            });
        }
        else {
            //Create alert
            createAlert('danger', loginPageAlertDiv, loginPageAlert, statusMsg);
        }
    });
    
});

$("#mapToLoginButton").click(function (e) { 
    e.preventDefault();

    //Fade in/out
    $(homePageDiv).fadeOut( "fast", function() {
        $(loginPageDiv).fadeIn("fast");
        resetAlerts();
    });

});

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


$('#testButton').click(function(){
    drop();
});

function geolocationSuccess(position) {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
	curLatLng = new google.maps.LatLng({lat: position.coords.latitude, 
                                        lng: position.coords.longitude});
                                        
    curLatLng = new google.maps.LatLng({lat: 33.4166317,
                                        lng: -111.9341069});

    //var geoLocationASU 	= {lat: 33.4166317, lng: -111.9341069};
    mapGeolocation(curLatLng, drop);
}

function geolocationError() {
	alert("Error in geolocation subsystem!");
}

function mapGeolocation(position, callback) {
    map.panTo(position);
    $('#homePageMapViewHeader').html(neighborhoods.length + " Events");
    $('#homePageMapViewSubHeader').html("near you...");
    $('#homePageMapViewHeader').fadeIn();
    $('#homePageMapViewSubHeader').fadeIn();
    callback();
}

$(buttonHeaderLeft).click(function(){
    if($(mapViewDiv).css('display') !== 'none'){
        $(mapViewDiv).hide();
        $(buttonHeaderLeftIcon).toggleClass("fa-list-ul")
        $(buttonHeaderLeftIcon).toggleClass("fa-map-o")
        $(listViewDiv).show();
    }
    else{
        $(searchViewDiv).hide();
        $(listViewDiv).hide();
        $(buttonHeaderLeftIcon).toggleClass("fa-map-o")
        $(buttonHeaderLeftIcon).toggleClass("fa-list-ul")
        $(mapViewDiv).show();
    }
})

$(buttonHeaderRight).click(function(){
    if($(searchViewDiv).css('display') === 'none'){
        if($(listViewDiv).css('display') !== 'none'){
            $(listViewDiv).hide();
        }
        $(mapViewDiv).hide();
        $(buttonHeaderLeftIcon).hide();
        $(buttonHeaderRightIcon).toggleClass("fa-search");
        $(buttonHeaderRightIcon).toggleClass("fa-times-circle-o");
        $(searchViewDiv).show();
    }
    else{
        $(searchViewDiv).hide();
        $(buttonHeaderLeftIcon).show();
        $(buttonHeaderRightIcon).toggleClass("fa-times-circle-o");
        $(buttonHeaderRightIcon).toggleClass("fa-search");

        if($(buttonHeaderLeftIcon).hasClass("fa-map-o")){
            $(listViewDiv).show();
        }
        else{
            $(mapViewDiv).show();
        }
        //$('#mapViewDiv').show();
    }
})

$('#testButton').click(function(){
    console.log("testButton clicked");
});

function showTab(event, tabName) {
    console.log("showTab called");
    // Declare all variables
    var i, tabContentElems, tabLinkElems;

    if(tabName === "calendarViewDiv" || tabName === "messagesViewDiv" || tabName === "profileViewDiv"){
        console.log(tabName + " div is passed");

        if($(buttonHeaderLeft).css('display') !== 'none'){
            $(buttonHeaderLeft).hide();
            $(buttonHeaderRight).hide();
        }
    }
    else{
        console.log(tabName + " div is passed(ELSE)");

        if($(buttonHeaderLeft).css('display') === 'none'){
            $(buttonHeaderLeft).show();
            $(buttonHeaderRight).show();
        }
    }

    // Get all elements with class="tabContent" and hide them
    tabContentElems = document.getElementsByClassName("bodyContent");
    for (i = 0; i < tabContentElems.length; i++) {
        tabContentElems[i].style.display = "none";
    }

    // Get all elements with class="tabLink" and remove class "active"
    tabLinkElems = document.getElementsByClassName("tabLink");
    for (i = 0; i < tabLinkElems.length; i++) {
        tabLinkElems[i].className = 
            tabLinkElems[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}

$('#exploreButton').click(function(){
    console.log("test jquery click");
})