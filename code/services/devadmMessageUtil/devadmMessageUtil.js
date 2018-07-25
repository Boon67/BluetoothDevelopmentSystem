function devadmMessageUtil(req, resp){
    var testGetTopicHistoryReqParams ={
        path:"get_topic_history",
        messageTopic:"devices/d1/status"
    };
    
    var testDeleteMessageReqParams ={
        path:"delete_message",
        messageTopic:"devices/d1/status",
        timeStampToDelete:0
    };
    
    var testPublishMessageReqParams ={
        path:"publish_message",
        messageTopic:"devices/d1/status",
        payload:{
          "acceleration": 0.26584707494434223,
          "deviceName": "d1",
          "temperature": 70.24167915904032,
          "uvlight": 107.25037477120934
        }
    };
    
    //req.params = testPublishMessageReqParams;
    
     var response = {
        err:false,
        messages:[],
        result : {}
    };
    
    var getTopicHistory = function() {
        ClearBlade.init({request:req});
        var messaging = ClearBlade.Messaging();
        var sinceCurrTimeInSeconds = parseInt(Date.now()/1000);
        var topic = req.params.messageTopic;
        var numberOfMessagesBeforeTimeStamp = 0; // 0 for all
        messaging.getMessageHistory(topic,sinceCurrTimeInSeconds, numberOfMessagesBeforeTimeStamp, function(err, body){
            if(err){
                response.err = true;
                response.messages.push("Unable to get device history");
                sendResponse();
            }
            else{
                response.result = body;
                sendResponse();
            }
        });

        
    };
    
    var deleteMessage = function() {
        ClearBlade.init({request:req});
        var messaging = ClearBlade.Messaging();
        var topic = req.params.messageTopic;
        var deleteBasedOnTimeStamp = req.params.timeStampToDelete;
            
        messaging.getAndDeleteMessageHistory(topic, 1, deleteBasedOnTimeStamp, deleteBasedOnTimeStamp, deleteBasedOnTimeStamp,function(err, body){
            if(err){
                response.err = true;
                response.messages.push("Unable to get device history");
                sendResponse();
            }
            else{
                response.result = body;
                sendResponse();
            }
        });
        sendResponse();
    }
    
    var publishMessage = function() {
        ClearBlade.init({request:req});
        var messaging = ClearBlade.Messaging();
        var payload = JSON.stringify(req.params.payload);
        messaging.publish(req.params.messageTopic, payload);
        response.messages.push("Message published to "+req.params.messageTopic);
        sendResponse();
    }
    
    var sendResponse = function(){
        if (response.err){
            resp.error(response)
        }else{
            resp.success(response);    
        }
        
    };
    

    if (req.params.path =="get_topic_history"){
        getTopicHistory();
    } else if (req.params.path =="delete_message"){
        deleteMessage();
    } else if (req.params.path =="publish_message"){
        publishMessage();
    }
}