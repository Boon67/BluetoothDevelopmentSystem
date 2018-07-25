var _resp, _req;
var _record;
tbl="device_data";

function logBLEHistory(req, resp) {
    ClearBlade.init({request:req});
    log(req.params);
    _resp=resp;
    _req=req;
    deviceid=JSON.parse(req.params.body).deviceid;
    devicedata=req.params.body;
    createRecord(tbl, {device_id:deviceid, device_data:devicedata, timestamp: Math.floor(Date.now()/1000)});
}
//Create a record
function createRecord(tbl, values) {
    var col = ClearBlade.Collection( {collectionName: tbl } );
    col.create(values, statusCallBack);
}

//Shared Status Callback
var statusCallBack = function (err, data) {
    if (err) {
        log("error: " + JSON.stringify(data));
    	_resp.error(data);
    } else {
        log(data);
    	_resp.success(data);
    }
};

