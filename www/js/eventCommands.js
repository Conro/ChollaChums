"use strict;"

var eventInfoMapCreated = false;
var eventMapMarkers = [];
var currentEvent = 0;

function getEventById(id, callback) {
    var statusMsg = "";

    $.get("http://chollachumsapi.azurewebsites.net/events/getById/" + id, function( response ) {
        if(response.success === true){
            //console.log(response);
            callback(response);
        }
    }).fail(function(){
        statusMsg = "Could not load event!";
        callback(undefined, statusMsg);
    });

}

function createEventViewMap(div, event){
    var element = document.getElementById(div);
    var location = {lat: event.lat, lng: event.lng};
    var content = event.name;
    var infowindow = new google.maps.InfoWindow()
    clearMap(null, eventMapMarkers);

    if(!eventInfoMapCreated) {
        eventMap = new google.maps.Map(element, {
            zoom: 17,
            center: location
        });
    
        var marker = new google.maps.Marker({
            position: location,
            map: eventMap,
            title: event.name,
            animation: google.maps.Animation.DROP
        });

        eventMapMarkers.push(marker);
        eventInfoMapCreated = true;
    }
    else {
        eventMap.panTo(location)

        var marker = new google.maps.Marker({
            position: location,
            map: eventMap,
            title: event.name,
            animation: google.maps.Animation.DROP
        });
        eventMapMarkers.push(marker);
    }
    

    google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
        return function() {
           infowindow.setContent(content);
           infowindow.open(map,marker);
        };
    })(marker,content,infowindow)); 
}

function toggleEventViewHeader(hide) {
    if(hide){
        $('#eventViewHeader').fadeOut();
    }
    else if(!hide) {
        $('#eventViewHeader').fadeIn();
    }
}

//Function that is called when a user wants to see event info. Event = event_id, source = where the function call originated
function goToEvent(eventId, source){
    //hideEventCountHeaders(true);
    $(eventViewOutputDiv).empty();
    $(buttonHeaderLeft).hide();
    $(buttonHeaderRight).hide();

    
    currentEvent = eventId;
    var event = $.grep(initialEvents.data, function(e){ return e.event_id == eventId; })
    console.log(event);

    console.log("go to event clicked");

    //already have the ID so i can just look it up in the array? Unless I need more info I don't have
    console.log("call API for event id: "+ eventId);

    //Tell me where you came from so I can go back to the right screen
    eventDetailsDesto = "";
    eventDetailsDesto = source;

    
    //Hide wherver you came from and show the eventViewDiv
    $(source).fadeOut(function(){

        //Get event info and display it!
        //This is where I put the event ID
        //           V
        getEventById(eventId, function(response, statusMsg){

            //Check if user is attending and set button accordingly
            getRSVP(function(result){
                setAttendButton(result);
            }, getUserInfo("user_id"), eventId);

            if(response){
                $(eventViewDiv).fadeIn(function(){
                    var date = new Date(response.data[0].date).toString('M/d/yy h:mmtt');

                    $(eventViewOutputDiv).append("<p><b>Event Name:</b> " + response.data[0].name + "</p><p><b>Description: </b>" + response.data[0].description 
                    + "</p><p><b>When: </b>" + date +"</p><p><b>Where: </b>" + response.data[0].location) + "</p>";
                    createEventViewMap("eventViewMapDiv", event[0]);
                });
            }
            else{
                $(eventViewDiv).fadeIn(function(){
                    $(eventViewOutputDiv).append("<p>" + statusMsg + "</p>");
                });
            }   
        });
    });

    var input = document.getElementById('testInput');
    var searchBox = new google.maps.places.SearchBox(input);

    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        console.log(places);

        //location = {lat: places[0].geometry.location.lat, lng: places[0].geometry.location.lng}     
        //console.log(location);

        if (places.length == 0) {
          return;
        }

        var marker = new google.maps.Marker({
            position: places[0].geometry.location,
            map: eventMap,
            title: places[0].name,
            animation: google.maps.Animation.DROP
        });


    });
}

function getInitialEvents(callback) {
    $.get("http://chollachumsapi.azurewebsites.net/events/getinitial/", function( response ) {
        if(response.success === true){
            initialEvents = response;
            //console.log(response);
            //console.log(initialEvents);
            callback(response);
        }
    }).fail(function(){
        statusMsg = "Could not load initial events!";
        callback(undefined, statusMsg);
    });

}

function clearMap(map, markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}



function toggleEventView(event, tabName) {

    var i, tabContentElems, tabLinkElems;

    // Get all elements with class="tabContent" and hide them
    tabContentElems = document.getElementsByClassName("eventDetailsContent");
    for (i = 0; i < tabContentElems.length; i++) {
        tabContentElems[i].style.display = "none";
    }

    // Get all elements with class="tabLink" and remove class "active"
    tabLinkElems = document.getElementsByClassName("eventTabLink");
    for (i = 0; i < tabLinkElems.length; i++) {
        tabLinkElems[i].className = 
            tabLinkElems[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}

function setAttendingButton(action) {

}

function setRSVP(callback, userid, eventid){
    $.get("http://chollachumsapi.azurewebsites.net/events/rsvp?userid=" + userid + "&eventid=" + eventid , function( response ) {
        if(response.success === true){
            console.log(response);
            if(response.data.attendingStatus === 1){
                console.log("userId: " + userid + " is attending eventid: " + eventid );
                result = true;
            }
            else{
                console.log("userId: " + userid + " is NOT attending eventid: " + eventid );
                result = false;
            }

            callback(result);
        }
    })
}

function getRSVP(callback, userid, eventid) {

    var result = false;

    $.get("http://chollachumsapi.azurewebsites.net/events/rsvpStatus?userid=" + userid + "&eventid=" + eventid , function( response ) {

        console.log(response);
        if(response.success === true){
            console.log("userId: " + userid + " is attending eventid: " + eventid );
            //$(eventViewOutputDiv).append("<p>USER IS ATTENDING THIS EVENT</p>");
            result = true;
        }
        else{
            console.log("userId: " + userid + " is NOT attending eventid: " + eventid );
            //$(eventViewOutputDiv).append("<p>USER IS ATTENDING THIS EVENT</p>");
            result = false;
        }

        callback(result);
    })
}

$('#eventViewBackButton').click(function(){
    //$(buttonHeaderLeft).show();
    //$(buttonHeaderRight).show();
    $(eventViewDiv).fadeOut(function(){
        $(eventDetailsDesto).fadeIn();
        $(buttonHeaderLeft).fadeIn();
        $(buttonHeaderRight).fadeIn();
    });
    //toggleEventViewHeader(true);
    //toggleHomePageHeader(false);

});

$('#attendingButton').click(function(){
    setRSVP(function(result){
        setAttendButton(result)
    }, getUserInfo('user_id'), currentEvent);
});

function setAttendButton(value) {
    if(value) {
        $('#attendingButton').html("Changed My Mind!")
    }
    else{
        $('#attendingButton').html("Attend!")        
    }
}

function getAttendees(callback, eventid) {
    $.get("http://chollachumsapi.azurewebsites.net/events/attendees/" + eventid, function( response ) {
        
        console.log(response);
        if(response.success === true){
            console.log("getting attendees for eventid: " + eventid);
            //$(eventViewOutputDiv).append("<p>USER IS ATTENDING THIS EVENT</p>");
        }
        else{
            console.log("userId: " + userid + " is NOT attending eventid: " + eventid );
            //$(eventViewOutputDiv).append("<p>USER IS ATTENDING THIS EVENT</p>");
        }

        callback(response);
    })
}

$('#eventPeopleHeaderButton').click(function(){

    $('#peopleViewOutputDiv').empty();

    getAttendees(function(response){
        for(var i = 0; i < response.data.length; i++) {
            $('#peopleViewOutputDiv').append(response.data[i].username + "<br>");
        };
    }, 4);
});

