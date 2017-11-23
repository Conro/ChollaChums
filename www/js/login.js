function login(username, password) {

    var success = false;

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
                console.log(data);
                console.log(username + " " + password);
                console.log("pre check" + success);

                if (data.Result.length !== 0){
                    if (data.Result[0].password === password){
                        console.log(data);
                        success = true;
                    }
                }
                else {
                    console.log("No results");
                    success = false;
                }
            }
            else {
                console.log("Failure");
                success = false;
            }
    });

    return success;
}

