function isValidColumnType(type){
    log("checking type: "+type)
    if (devadm_validTypes.indexOf(type) > -1){
        return true
    } else{
        return false;
    }
}

function isValidName(name){
    var regex = /[a-zA-Z][a-zA-Z0-9-_]*$/;
    if(!name || typeof(name) !== "string" || !regex.test(name)){
            return false;
    }
    return true;
}
var devAuthToken = "";
var authDeveloper = function(callback) {
    if (devAuthToken === ""){
        var options = {
            uri: devadm_platform_url+"/admin/auth/",
            body: {"email":devadm_developer_email,"password":devadm_developer_password}
        };
        var requestObject = Requests();
        requestObject.post(options, function(err,httpresponse) {
            if (err !== false){
                resp.error(err);
            }
             else {
               developer_token = httpresponse.dev_token
               httpresponse = JSON.parse(httpresponse);
               devAuthToken = httpresponse.dev_token;
               callback(httpresponse.dev_token);
            }
            
        });
    }else{
        callback(devAuthToken);
    }
};
        
 function addColumnToDeviceTable(systemKey, columnName, columnType, addColumnCallback){
    authDeveloper(function(devToken){
        var apiEndpoint = "admin/devices/"+ systemKey +"/columns";
        var url = devadm_platform_url+"/"+ apiEndpoint;
       
        if(!isValidColumnType(columnType) || !isValidName(columnName)){
            
            addColumnCallback(true, "not a valid column name or type")
        }
        else{
            var http = Requests();
            
            var requestOptions  = {
                url,
                headers:{
                    "ClearBlade-DevToken":devToken
                },
                body:{"column_name":columnName,"type":columnType}
            }
            
            http.post(requestOptions, function(err, r){
                addColumnCallback(err, r);
            });
        }
    });
    
}
