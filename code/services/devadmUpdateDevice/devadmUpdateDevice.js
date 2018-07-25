function devadmUpdateDevice(req, resp){
    
    var testCreateDeviceReqParams ={
        path:"create_device",
        name:"deviceX",
        active_key:"abcdef",
        type:"laser"
    };
    
    var testUpdateDeviceReqParams ={
        path:"update_device",
        deviceInfo : {}
    };
    
    var testDeleteDeviceReqParams ={
        path:"delete_device",
        name:"deviceX"
    };
    
    // req.params = testCreateDeviceReqParams;
    
    var response = {
        err:false,
        messages:[],
        result : {}
    };
    
    var createDevice = function() {
        ClearBlade.init({request: req});

    	var DEVICE_TRIGGER_ENABLED = true
    
    	var device = {
    		name: req.params.name,
    		active_key: req.params.active_key,
    		type: req.params.type,
    		state: "",
    		enabled: true,
    		allow_key_auth: true,
    		allow_certificate_auth: false
    	};
    
    	ClearBlade.createDevice(device.name, device, DEVICE_TRIGGER_ENABLED, function(err, data) {
    		if(err){
    			response.err = true;
            	response.messages.push("Unable to create device");
            	sendResponse();
    		}
    		response.messages.push("Device created");
            sendResponse();
    	});

    }
    
    var updateDevice = function() {
         ClearBlade.init({request:req});
        var dev = ClearBlade.Device();
        var query = ClearBlade.Query();
        var name = req.params.deviceInfo.name;
        delete req.params.deviceInfo.name;
        delete req.params.deviceInfo.system_key;
        query.equalTo("name", name);    
        dev.update(query, req.params.deviceInfo,  function (err, r) {
            if (err) {
            	response.err = true;
            	response.messages.push("Unable to update device");
            	sendResponse();
            } else {
            	response.messages.push("Device updated");
            	sendResponse();
            }
        });
    }
    
    var deleteDevice = function() {
       ClearBlade.init({request: req});
    
    	// Default is true, so device table changes can trigger code services
    	var DEVICE_TRIGGER_ENABLED = true
    
    	ClearBlade.deleteDevice(req.params.name, DEVICE_TRIGGER_ENABLED, function(err, data) {
    		if(err) {
    			response.err = true;
            	response.messages.push("Unable to delete device");
            	sendResponse();
    		}
    
    		response.messages.push("Device deleted");
            sendResponse();
    	});
 
    }
   
    var sendResponse = function(){
        if (response.err){
            resp.error(response);
        }else{
            resp.success(response);    
        }
    };
    
    if (req.params.path =="create_device"){
        createDevice();
    } else if (req.params.path =="delete_device"){
        deleteDevice();
    } else if (req.params.path =="update_device"){
        updateDevice();
    }
}