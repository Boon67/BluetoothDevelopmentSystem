var _COLLECTIONNAME="dev_admin_devicetypes"
function devadmin_TypeUtil(req, resp){
    log(req)
    var testGetDeviceTypeReqParams ={
        path:"get_device_type",
        deviceType:"wrench3"
       
    };
    
    var testCreateDeviceTypeReqParams ={
        path:"create_device_type",
        deviceType:"wrench"
    };
    
    var testDeleteDeviceTypeReqParams ={
        path:"delete_device_type",
        deviceType:"wrench"
        
    };
    
     var testUpdateDeviceTypeReqParams ={
        path:"update_device_type",
        deviceType:"wrench",
        schema:[{"id":"abc","name":"property1", "type":"string"},{"id":"xyz","name":"property2", "type":"string"}]
        
    };
    
     //req.params = testUpdateDeviceTypeReqParams;
    
     var response = {
        err:false,
        messages:[],
        result : {}
    };
    
    var getDeviceTypes = function() {
        ClearBlade.init({request:req});
        var collections = ClearBlade.Collection({collectionName: _COLLECTIONNAME});
        var deviceType = req.params.deviceType;
       	var query = ClearBlade.Query();
       	if (typeof deviceType != "undefined" && deviceType !==""){
       	    log("searching for a specific device type of :"+deviceType)
       	    query.equalTo('type',deviceType);
       	}
    	var getTypeSchemaResponse;
    
        collections.fetch(query, function(err, body){
            if(err){
                response.err = true;
                response.messages.push(body);
                sendResponse();
            }
            else{
                getTypeSchemaResponse = body;
                response.result = body.DATA;
                sendResponse();
            }
        });
        
    };
    
    var createDeviceType = function(){
        ClearBlade.init({request:req});
        var collections = ClearBlade.Collection({collectionName: _COLLECTIONNAME});
        var newDeviceType = {type:req.params.deviceType};
        
        collections.create(newDeviceType, function(err, body){
            if(err){
                response.err = true;
                response.messages.push("Missing Parameters");
                sendResponse();
            }
            else{
                log(body);
                response.result = body;
                sendResponse();
            }
        });
        
        
    }
    
    var updateDeviceType = function(){
        
        var GetDeviceTableColumns= function(  ){
            var url = devadm_platform_url+"/api/v/3/devices/"+ req.systemKey+"/columns";
            var requestOptions = {
                "url":url,
                "headers":{
                "ClearBlade-UserToken":req.userToken
                }
            }
            var callback = function (err, deviceColumns) {
                if (err) {
                	resp.error(err);
                } else {
                    deviceTableColumnsMap = {};
                    deviceColumns = JSON.parse(deviceColumns);
                    for (var i=0;i<deviceColumns.length;i++) {
                        var col = deviceColumns[i];
                        deviceTableColumnsMap[col.ColumnName] =  col.ColumnType;
                    }
                    
                    for (var key in req.params.schema) {
                        lowerKey = key.toLowerCase()
                        if (lowerKey in deviceTableColumnsMap){
                            
                        }else {
                            // we need to add the column
                            addColumnToDeviceTable(req.systemKey, lowerKey, req.params.schema[key], function(){
                            });
                        }
                        
                    }
                    response.messages.push("Completed update of device type");
                    sendResponse();
                }
            }
            var http = Requests();
            http.get(requestOptions, callback);
        }
        
        ClearBlade.init({request:req});
        var collections = ClearBlade.Collection({collectionName: _COLLECTIONNAME});
        var query = ClearBlade.Query();
        var deviceType = req.params.deviceType;
       	query.equalTo('type',deviceType);
        var changes = {
            "schema":JSON.stringify(req.params.schema)
        }
        log(changes);
        collections.update(query, changes, function(err, body){
            if(err){
                log("error adding schema");
                log(body)
                response.err = true;
                response.messages.push("Error adding schema to device type:"+body);
                sendResponse();
            }
            else{
                response.messages.push("Updated Schema succesfully");
                GetDeviceTableColumns();
                
            }
        });
    };
    
    
    var deleteDeviceType = function() {
        ClearBlade.init({request:req});
        var collections = ClearBlade.Collection({collectionName: _COLLECTIONNAME});
        var query = ClearBlade.Query();
        var deviceType = req.params.deviceType;
       	query.equalTo('type',deviceType);
        collections.remove(query, function(err, body){
            if(err){
                response.err = true;
                response.messages.push("Error deleting device type");
                sendResponse();
            }
            else{
                response.messages.push("Deleted device type succesfully");
                sendResponse();
                
            }
        });
    };
    
    var sendResponse = function(){
        if (response.err){
            resp.error(response);
        }else{
            resp.success(response);    
        }
        
    };
    
    if (req.params.path=="get_device_type"){
        getDeviceTypes();
    } else if (req.params.path =="create_device_type"){
        createDeviceType();
    } else if (req.params.path =="delete_device_type"){
        deleteDeviceType();
    } else if (req.params.path =="update_device_type"){
        updateDeviceType();
    }
    
}