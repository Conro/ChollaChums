function login(username, password, callback) {

    var success = false;
    var statusMsg = "";

    $('#loginLoadingDiv').fadeIn("fast");

    var query = "SELECT * FROM users \
    WHERE username = '"+ username + "'";

    MySql.Execute(
        "dmazzola.com", 
        "mweary2", 
        "wear5238", 
        "test_db_mweary2", 
        query, 
        function (data) {
            if (data.Success){ 

                //Check if results length does not equal 0 (this means user was found).
                if (data.Result.length !== 0){

                    //If user was found, check if supplied password matches password stored in the database.
                    if (data.Result[0].password === password){
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
            callback(success);
            $('#loginLoadingDiv').fadeOut("fast");
    });
}

