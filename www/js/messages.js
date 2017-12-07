/*
 * messages.js
 * For Messagaes div
 */

"use strict;"

 //divs
 var messagesViewDiv = $('#messagesViewDiv');
 var messageHome = $("#messagehome");
 var messageView = $("#viewmessage");

 $('messagesButton').click(function(e){
 	//$('#chatmessages').scrollTop($('#chatmessages')[0].scrollHeight);
 });

//focus when clicking in the send message div
$('#sendmessage').click(function() {
     $('#usermsg').focus();
});

//using enter key works to submit
$('#submitbtn').keypress(function (e) {
  if (e.which == 13) {
    $('form#messageform').submit();
    return false;    //<---- Add this line
  }
});

function showMessage(){
	$(messageHome).fadeOut(function(){
        $(messageView).fadeIn();
    });
}