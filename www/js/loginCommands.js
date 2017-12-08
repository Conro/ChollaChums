"use strict;"
//Login vars
var userLoginInput = $('#userLoginInput');
var passwordLoginInput = $('#passwordLoginInput');
var loginForm = $('#loginForm');
var loginLoadingDiv = $('#loginLoadingDiv');
var currentUser = {};

//Signup vars
var signUpLoadingDiv = $('#signUpLoadingDiv');
var signUpForm = $('#signUpForm');

function login(callback) {
        resetLoadingDivs();
        resetAlerts();
    
        var success = false;
        var statusMsg = "";
        var username = "";
        var password = "";
    
        //Check if a username was entered before assigning
        if ($('#userLoginInput').val() !== undefined){
            username = $('#userLoginInput').val();
        }
    
        //Check if a password was entered before assigning
        if ($('#passwordLoginInput').val() !== undefined){
            password = $('#passwordLoginInput').val();
        }

        //Display loading wheel 
        console.log("start loginForm fadeout");
        $(loginForm).fadeOut("fast", function(){
            console.log("loginForm fadeout completed, starting loginLoadingDiv fadeIn");
            $(loginLoadingDiv).fadeIn("fast", function(){
                $.get("http://chollachumsapi.azurewebsites.net/users/username/" + username, function( response ) {
                    console.log(response);
                    
            
                    //Check if results length does not equal 0 (this means user was found).
                    if (response.data.length !== 0){
                        
                        //If user was found, check if supplied password matches password stored in the database.
                        if (response.data[0].pword === password){
                            statusMsg = "Passwords matched, authorized login";
                            setCurrentUser(response.data[0]);
                            success = true;
                        }
                        else {
                            console.log("in else for password matching");
                            statusMsg = "<b>Your login details are incorrect!</b>";
                            success = false;
                            $(loginForm).fadeIn("fast");
                            
                            if($(loginLoadingDiv).css('display') !== 'none'){
                                $(loginLoadingDiv).hide();
                            }
                        }
                    }
            
                    //Callback after function completes
                    callback(success, statusMsg);
                    $('#loginLoadingDiv').fadeOut("fast");
            
                  }).fail(function(){
                    statusMsg = "<b>Your login details are incorrect!</b>";
                    success = false;
                    $(loginForm).fadeIn();
                    if($(loginLoadingDiv).css('display') !== 'none'){
                        $(loginLoadingDiv).hide();
                    }

                    callback(success, statusMsg);
                    $('#loginLoadingDiv').fadeOut("fast");

                  })
            });

            
        });
    /*
        //--------------------------USING OUR API----------------------------------------------------------------------------
        $.get("http://chollachumsapi.azurewebsites.net/users/username/" + username, function( response ) {
            console.log(response);
            
    
            //Check if results length does not equal 0 (this means user was found).
            if (response.data.length !== 0){
                
                //If user was found, check if supplied password matches password stored in the database.
                if (response.data[0].pword === password){
                    statusMsg = "Passwords matched, authorized login";
                    success = true;
                }
                else {
                    console.log("in else for password matching");
                    statusMsg = "<b>Your login details are incorrect!</b>";
                    success = false;
                    $(loginForm).fadeIn("fast");
                    
                    if($(loginLoadingDiv).css('display') !== 'none'){
                        $(loginLoadingDiv).hide();
                    }
                }
            }
            //Results length is 0 meaning no user found by that username.
            else {
                console.log("in else for response.data length");
                statusMsg = "<b>Your login details are incorrect!</b>";
                success = false;
                $(loginForm).fadeIn();
                if($(loginLoadingDiv).css('display') !== 'none'){
                    $(loginLoadingDiv).hide();
                }
            }
    
            //Callback after function completes
            callback(success, statusMsg);
            $('#loginLoadingDiv').fadeOut("fast");
    
          });
    
          //--------------------------END USING OUR API----------------------------------------------------------------------------
    */
        /*
    
        var loginQuery = "SELECT * FROM users \
        WHERE username = '"+ username + "'";
    
        MySql.Execute(
            "dmazzola.com", 
            "mweary2", 
            "wear5238", 
            "test_db_mweary2", 
            loginQuery, 
            function (data) {
                if (data.Success){ 
    
                    //Check if results length does not equal 0 (this means user was found).
                    if (data.Result.length !== 0){
    
                        //If user was found, check if supplied password matches password stored in the database.
                        if (data.Result[0].pword === password){
                            statusMsg = "Passwords matched, authorized login";
                            success = true;
                        }
                        else {
                            statusMsg = "Your login details are incorrect!";
                            success = false;
                        }
                    }
                    //Results length is 0 meaning no user found by that username.
                    else {
                        statusMsg = "Your login details are incorrect!";
                        success = false;
                    }
                }
                //Query was not successful.
                else {
                    statusMsg = "There was a problem connecting to the server!";
                    success = false;
                }
    
                //Callback after function completes
                callback(success, statusMsg);
                $('#loginLoadingDiv').fadeOut("fast");
        });*/
    }
    
    function createAccount(callback) {
        resetLoadingDivs();
        resetAlerts();
    
        var statusMsg = "";
        var user = undefined;
    
        var nickname = $('#nickNameInputReg').val();
        var username = $('#usernameInputReg').val();
        var email = $('#emailInputReg').val();
        var uni = $('#universitySelectInputReg').val();
        var pass = $('#passInputReg').val();
        var confPass = $('#passConfInputReg').val();
    
        //Create object that holds the new user data
        var user =
        {
            "username": username,
            "screen_name": nickname,
            "email": email,
            "university": uni,
            "pword": pass
        };
    
        //console.log(user);
    
        //Convert user to JSON object for the request
        var userJson = JSON.stringify(user);

        //Display loading wheel 
        $(signUpForm).fadeOut("fast", function(){
            $(signUpLoadingDiv).fadeIn("fast", function(){
                $.ajax({
                    url: 'http://chollachumsapi.azurewebsites.net/users/',
                    type: 'post',
                    data: userJson,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type':'application/json'
                    },
                    dataType: 'json',
                    success: function (data) {
                        
                        var success = data.success;
            
                        console.log(success);
            
                        if (success){
                            statusMsg = "<b>Woot! Welcome " + username + "</b>!<br>Try logging in!"
                            console.log("Woot! Welcome " + username + "!<br>Try logging in!");
                            callback(success, statusMsg, username);
                        }
                        else if (!success){
                            statusMsg = "<b>That username is already taken!</b><br>Please choose another!"
                            console.log("That username is already taken!");
        
                            $(signUpLoadingDiv).fadeOut("fast", function(){
                                $(signUpForm).fadeIn("fast");
                                callback(success, statusMsg);
                            });
                        }
                        else {
                            statusMsg = "Error connecting to server!"
                            console.log("Error connecting to server!");
                            callback(success, statusMsg);
                        }
                    }
                });
            });
        });
    
        
    
        /*
        $.post( "http://chollachumsapi.azurewebsites.net/users", userJson, function( data ) {
            console.log(data);
          });*/
    
    
    
       /* var insertQuery = "INSERT INTO users (username, screen_name, email, university, pword) \
        SELECT * FROM (SELECT '" + username + "' as username, \
                                '" + name + "' as screen_name,\
                                '" + email + "' as email,\
                                '" + uni  + "' as university,\
                                '" + pass + "' as password) as tmp\
        WHERE NOT EXISTS (\
            SELECT username\
            FROM users\
            WHERE username = 'conor') LIMIT 1;"
    
    
    
        
        var existsQuery = "SELECT username FROM users \
        WHERE username = '"+ username + "' \
        AND email = '"+ email + "'";
    
        var insertQuery = "INSERT INTO test_db_mweary2.users (username, screen_name, email, university, pword)\
        VALUES ('" + username + "', '" + name + "', '" + email + "', '" + uni + "', '" + pass + "');"
    
        MySql.Execute(
            "dmazzola.com", 
            "mweary2", 
            "wear5238", 
            "test_db_mweary2",
            insertQuery, 
            function (data) {
                console.log(data);
                if (data.Success){ 
                    
                    //Check if results length does not equal 0 (this means user was found).
                    if (data.Result.length  === 0){
                        statusMsg = "Account doesn't exist!";
                        console.log(statusMsg);
    
                        
    
                        success = true;
                    }
                    //Results length is 0 meaning no user found by that username.
                    else {
                        //statusMsg = "Account already exists!";
                        //console.log(statusMsg);
                        //success = false;
                    }
                }
                else {
                    statusMsg = "Account already exists";
                    console.log(statusMsg);
                    success = false;
                }
    
                //Callback after function completes
                callback(success, statusMsg);
                $('#loginLoadingDiv').fadeOut("fast");
        });
    
        */
    }
    
    function setCurrentUser(user) {
        console.log("Setting current user...");
        currentUser = {
            user_id: user.user_id,
            username: user.username,
            screen_name: user.screen_name,
            university: user.university,
            email: user.email
        }

        localStorage.setItem('currentChollaUser', JSON.stringify(currentUser));
        //localStorage.clear();
    }
    
    function getCurrentUser() {
        console.log("Getting current user...");

        if(checkForUser()){
            var currUserString = localStorage.getItem('currentChollaUser');
            var currUser = JSON.parse(currUserString);
            return currUser;
        }
        else{
            return false;
        }
    }

    function checkForUser() {
        if(localStorage.getItem('currentChollaUser') !== null){
            console.log("user exists");
            return true;
        }          
        else{
            console.log("user doesn't exist");
            return false;
        }     
    }

    function getUserInfo(info) {      
        if(checkForUser()){
            if(info === "user_id"){
                var currUserString = localStorage.getItem('currentChollaUser');
                var currUser = JSON.parse(currUserString);
                return currUser.user_id;    
            } 
        }
    }
    
    
    