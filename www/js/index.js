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


//Map vars
var mapScriptCreated = false;
var mapElement = undefined;
var homePageMarkers = [];
var initialEvents = [];
var searchEvents = [];
var curLatLng = undefined;

//Home page vars
var buttonHeaderLeft = $('#buttonHeaderLeft');
var buttonHeaderRight = $('#buttonHeaderRight');
var buttonHeaderLeftIcon = $('#buttonHeaderLeftIcon');
var buttonHeaderRightIcon = $('#buttonHeaderRightIcon');
var mapViewDiv = $('#mapViewDiv');
var listViewDiv = $('#listViewDiv');
var listViewOutputDiv = $('#listViewOutputDiv');
var searchViewDiv = $('#searchViewDiv');
var searchViewForm = $('#searchViewForm');
var searchViewResults = $('#searchViewResults');
var calendarViewDiv = $('#calendarViewDiv');
var messagesViewDiv = $('#messagesViewDiv');
var profileViewDiv = $('#profileViewDiv');
var eventViewDiv = $('#eventViewDiv');
var eventViewOutputDiv = $('#eventViewOutputDiv');
var eventsModified = true;
var eventDetailsDesto = "";
var homePageMapViewHeader = $('#homePageMapViewHeader');
var homePageMapViewSubHeader = $('#homePageMapViewSubHeader');
var homePageHeader = $('#homePageHeader');

//Msgs page vars
var messageHome = $('#messagehome');
var viewMessage = $('#viewmessage');


/* wait until all phonegap/cordova is loaded then call onDeviceReady*/
document.addEventListener("deviceready", onDeviceReady, false);

//only for mobile
function onDeviceReady(){
    mapElement = document.getElementById('mapViewDiv');
    var map = undefined;
    var eventMap = undefined;
    $('#userLoginInput').focus();

      //localStorage.clear();

    if(checkForUser()){
        $('#loginPageDiv').hide();
        $('#homePageDiv').fadeIn();         
        $("#exploreButton").click();

        //Check if map is created already, no use in doing it twice
        if(!mapScriptCreated){
            loadMapScript('initMap');
        }
    }
    else{
    $('#loginPageDiv').fadeIn();
    }
}


$( document ).ready(function() {
    mapElement = document.getElementById('mapViewDiv');
    var map = undefined;
    var eventMap = undefined;
    $('#userLoginInput').focus();

      //localStorage.clear();

    if(checkForUser()){
        $('#loginPageDiv').hide();
        $('#homePageDiv').fadeIn();         
        $("#exploreButton").click();

        //Check if map is created already, no use in doing it twice
        if(!mapScriptCreated){
            loadMapScript('initMap');
        }
    }
    else{
    $('#loginPageDiv').fadeIn();
    }
});

//Drops inital markers on map
function drop() {
    clearMarkers();
    for (var i = 0; i < initialEvents.data.length; i++) {
        addMarkerWithTimeout(initialEvents.data[i], i * 200);
    }
}

//Adds new marker
function addNewMarker(event, map) {

    var location = {lat: event.lat, lng: event.lng};
    var content = event.name;
    var infowindow = new google.maps.InfoWindow()

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: event.name,
        animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
        return function() {
           infowindow.setContent(content);
           infowindow.open(map,marker);
        };
    })(marker,content,infowindow)); 
}

function addMarkerWithTimeout(location, timeout) {
    var position = {lat: location.lat, lng: location.lng};
    var title = location.name
    var date = new Date(location.date).toString('M/d/yy');
    var time = new Date(location.date).toString('h:mmtt')
    var content = "<b>" + location.name + "<br>" + date + "<br>" + time + "<br><a href=\"#\" onclick=\"goToEvent(" + location.event_id + ", mapViewDiv); return false;\">Event Details</a>";
    var infowindow = new google.maps.InfoWindow()
    
    window.setTimeout(function() {

        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title,
            animation: google.maps.Animation.DROP
        });

        homePageMarkers.push(marker);
    
        google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
            return function() {
               infowindow.setContent(content);
               infowindow.open(map,marker);
            };
        })(marker,content,infowindow)); 

    }, timeout);
}

function clearMarkers() {
    for (var i = 0; i < homePageMarkers.length; i++) {
        homePageMarkers[i].setMap(null);
    }
    homePageMarkers = [];
}

function initMap() {
    
    //replace this with current location
    //var geoLocationASU 	= {lat: 33.4166317, lng: -111.9341069};

    

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
    var placeslib = "&libraries=places"

	var srcURL 		 = googleAPIUrl + '?key=' + googleAPIKey  + placeslib
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

    //Fade in/out
    $(loginPageDiv).fadeOut( "fast", function() {
        $('#registerButton').prop('disabled', true);
        $('#usernameInputReg').focus();


        if($(signUpPageDiv).css('display') === 'none'){
            $(signUpPageDiv).show();
            $(signUpLoadingDiv).hide();
        }

        //$(signUpPageDiv).fadeIn("fast");
        //$(signUpLoadingDiv).fadeOut("fast");


        $(signUpForm).fadeIn("fast");

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
    resetLoadingDivs();
    resetAlerts();

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
        $("#exploreButton").click();
        $(homePageDiv).fadeIn("fast");
        if(!mapScriptCreated){
            loadMapScript('initMap');
        }
    });*/
    

    if(checkForUser()){

    }

    
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
            resetLoadingDivs();
            createAlert('danger', loginPageAlertDiv, loginPageAlert, statusMsg);
        }
    });
    
});

$("#mapToLoginButton").click(function (e) { 
    e.preventDefault();

    //Fade in/out
    $(homePageDiv).fadeOut( "fast", function() {
        $(loginPageDiv).fadeIn("fast");
        $(loginForm).fadeIn("fast");
        resetAlerts();
        localStorage.clear();
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

    //clear classes first
    $(div).removeClass();

    //Add appropriate styles and msg to alert
    $(div).addClass(alertClass);
    $(div).html(msg);

    //Show the alert
    $(pdiv).fadeIn("fast");
}

$('.clickableDiv').click(function(e){

})

$('#buttonHeaderLeft').click(function(){
    //Check length before working with array
    if(initialEvents.data.length !== 0){
        //Check if the list needs to be rewritten (updated list)
        if(eventsModified){
            $('#listViewOutputDiv').empty();
            initialEvents.data.forEach(function(element) {
                //element.description
                var event = "<div id=" + element.event_id + " onclick=\"goToEvent(" + element.event_id + ", listViewDiv); return false;\" class=\"listViewItem\"><div class=\"container-fluid\"><h4>" 
                + element.name + "</h4><p><i class=\"fa fa-map-marker\" aria-hidden=\"true\"></i>&nbsp2.1 Miles Away</p><p>Tags go here!</p></div></div>"
                $('#listViewOutputDiv').append(event);
            }, this);

            //Now that the printed list is up to date, reset this variable to false
            eventsModified = false;
        }
    }
});

function geolocationSuccess(position) {
    //current lat/lng
	//curLatLng = new google.maps.LatLng({lat: position.coords.latitude, 
    //                                    lng: position.coords.longitude});
       
    //test lat/lng (asu)
    curLatLng = new google.maps.LatLng({lat: 33.4166317,
                                        lng: -111.9341069});

    //var geoLocationASU 	= {lat: 33.4166317, lng: -111.9341069};
    //mapGeolocation(curLatLng, drop);

    getInitialEvents(function(){
        mapGeolocation(curLatLng, drop());
    })
}

function geolocationError() {
	alert("Error in geolocation system!");
}

//function mapGeolocation(position) {
function mapGeolocation(position, callback) {
    map.panTo(position);
    setEventCountHeaders();
}

function setEventCountHeaders(){
    setPageHeader("home");
    $(homePageMapViewHeader).fadeIn();
    $(homePageMapViewSubHeader).fadeIn();
}

function hideEventCountHeaders(hide) {
    if(hide){
        $(homePageMapViewHeader).hide();
        $(homePageMapViewSubHeader).hide();
    }
    else{
        $(homePageMapViewHeader).show();
        $(homePageMapViewSubHeader).show();
    }
}

function toggleHomePageHeader(hide){
    if(hide){
        $(homePageHeader).hide();
    }
    else {
        $(homePageHeader).show();
    }
}
//Annoying logic for header left button
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

//Annoying logic for header right button
$(buttonHeaderRight).click(function(){
    if($(searchViewDiv).css('display') === 'none'){
        if($(listViewDiv).css('display') !== 'none'){
            $(listViewDiv).hide();
        }
        $(mapViewDiv).hide();
        $(buttonHeaderLeftIcon).hide();
        $(buttonHeaderRightIcon).toggleClass("fa-search");
        $(buttonHeaderRightIcon).toggleClass("fa-times-circle-o");
        setPageHeader("search");
        $(searchViewDiv).show();
        $('#searchViewForm').show();
        $('#searchViewResults').hide();
        $('#searchInput').val("");
    }
    else{
        $(searchViewDiv).hide();
        $(buttonHeaderLeftIcon).show();
        $(buttonHeaderRightIcon).toggleClass("fa-times-circle-o");
        $(buttonHeaderRightIcon).toggleClass("fa-search");
        setPageHeader("home");

        if($(buttonHeaderLeftIcon).hasClass("fa-map-o")){
            $(listViewDiv).show();
        }
        else{
            $(mapViewDiv).show();
        }
        //$('#mapViewDiv').show();
    }
})

function showTab(event, tabName) {
    // Declare all variables
    var i, tabContentElems, tabLinkElems;

    if(tabName === "calendarViewDiv" || tabName === "messagesViewDiv" || tabName === "profileViewDiv"){

        if($(buttonHeaderLeft).css('display') !== 'none'){
            $(buttonHeaderLeft).hide();
            $(buttonHeaderRight).hide();
        }
    }
    else{

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

//Resets the loading divs. Can specify 1is need be.
function resetLoadingDivs(div){
    if(div === undefined){
        $(signUpLoadingDiv).hide();
        $(loginLoadingDiv).hide();
    }
    else{
        $(div).hide();
    }
}

//Used to set the page header
function setPageHeader(state) {
    if(state === "home"){
        //Set headers text
        $(homePageMapViewHeader).html(initialEvents.data.length + " Events");
        $(homePageMapViewSubHeader).html("near you...");

        //Make sure they are visible lol
        $(homePageMapViewHeader).show();
        $(homePageMapViewSubHeader).show();
    } 
    else if(state === "search"){
        $(homePageMapViewHeader).html("Search Events");
        $(homePageMapViewSubHeader).hide();

        $(homePageMapViewHeader).show();
    }
    else if(state === "eventDetails"){
        $(homePageMapViewHeader).html("Event Details");
        $(homePageMapViewSubHeader).hide();

        $(homePageMapViewHeader).show();
    }
    else if(state === "searchResults") {
        $(homePageMapViewHeader).html("Search Results");
        $(homePageMapViewSubHeader).hide();

        $(homePageMapViewHeader).show();
    }
}

//Toggles views
function toggleView(desto, source) {
    $(source).fadeOut(function(){
        $(desto).fadeIn();
    });
}

//Toggles the msg view
function toggleMessage(desto){
    var msgHome = document.getElementById('messagehome');
    msgHome.setAttribute('style', 'display:none !important');
    $(desto).show();
}

//Function called when a convo is clicked
function showMessage(){
    toggleMessage(viewMessage);
}

//This has to be empty for some reason to make the entire app work lol.
$('#exploreButton').click(function(){

});

$('#messagesButton').click(function(){
    toggleView(messageHome, viewMessage);
});