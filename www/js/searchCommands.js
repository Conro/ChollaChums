"use strict;"

//Used for search related functions
var searchString = "";

$("#searchForm").submit(function(e){
    e.preventDefault();

    setPageHeader('searchResults');

    console.log("search form submit");

    searchString = $('#searchInput').val();
    $('#searchResultsOutput').empty();
    
    toggleView(searchViewResults, searchViewForm);
    loadResultsPage();
})

function search(callback, keyword) {
    var statusMsg = "";
    
    $.get("http://chollachumsapi.azurewebsites.net/events/getByKeyword/" + keyword, function( response ) {
        if(response.success === true){
            //console.log(response);
            callback(response, statusMsg);
        }
    }).fail(function(){
        statusMsg = "Could not find any events with that keyword!";
        callback(undefined, statusMsg);
    });
}

function loadResultsPage() {
    search(function(response, statusMsg){
        if(response){
            console.log(response);

            response.data.forEach(function(element) {
                console.log(element);
                //element.description
                var event = "<div id=" + element.event_id + " onclick=\"goToEvent(" + element.event_id + ", searchViewDiv); return false;\" class=\"listViewItem\"><div class=\"container-fluid\"><h4>" 
                + element.name + "</h4><p><i class=\"fa fa-map-marker\" aria-hidden=\"true\"></i>&nbsp2.1 Miles Away</p><p>Tags go here!</p></div></div>"
                $('#searchResultsOutput').append(event);
            }, this);

        }
        else{
            $('#searchResultsOutput').append(statusMsg);
        }
    }, searchString);
}