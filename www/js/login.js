/*$.ajaxSetup({
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Access-Control-Allow-Origin": "*"
    }
});*/

function login(callback) {
    
        //Display loading wheel 
        $('#loginLoadingDiv').fadeIn("fast");
    
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
                    statusMsg = "<b>Your login details are incorrect!</b>";
                    success = false;
                }
            }
            //Results length is 0 meaning no user found by that username.
            else {
                statusMsg = "<b>Your login details are incorrect!</b>";
                success = false;
            }
    
            //Callback after function completes
            callback(success, statusMsg);
            $('#loginLoadingDiv').fadeOut("fast");
    
          });
    
          //--------------------------END USING OUR API----------------------------------------------------------------------------
    
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
    
        var statusMsg = "";
        var user = undefined;
        
        //$('#loginLoadingDiv').fadeIn("fast");
    
        var nickname = $('#nickNameInputReg').val();
        var username = $('#usernameInputReg').val();
        var email = $('#emailInputReg').val();
        var uni = $('#universitySelectInputReg').val();
        var pass = $('#passInputReg').val();
        var confPass = $('#passConfInputReg').val();
    
        /*
        var name = "testedfhsfhds";
        var username = "conor111222222";
        var email = "test";
        var uni = "test";
        var pass = "test";
        var confPass = "test";
        console.log(name);
        console.log(username);
        console.log(email);
        console.log(uni);
        console.log(pass);
        console.log(confPass);*/
    
        //Create object that holds the new user data
        var user =
        {
            "username": username,
            "screen_name": nickname,
            "email": email,
            "university": uni,
            "pword": pass
        };
    
        console.log(user);
    
        //Convert user to JSON object for the request
        var userJson = JSON.stringify(user);
    
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
                    console.log("That username is already taken!<br>Please choose another!");
                    callback(success, statusMsg);
                }
                else {
                    statusMsg = "Error connecting to server!"
                    console.log("Error connecting to server!");
                    callback(success, statusMsg);
                }
            }
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
    
    function setCurrentUser() {
    
    }
    
    function getCurrentUser() {
    
    }
    
    
    