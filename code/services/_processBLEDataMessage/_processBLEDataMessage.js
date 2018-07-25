var _resp, _req;
var _record;
tbl="device_data";
target="/_platform";

function _processBLEDataMessage(req, resp) {
    ClearBlade.init({request:req});
    var msg = ClearBlade.Messaging();
    //log(req);
    _resp=resp;
    _req=req;
    deviceid=JSON.parse(req.params.body).deviceid;
    devicedata=req.params.body;
    //log(ClearBlade.edgeId());
    msg.publish(ClearBlade.edgeId() + "ble" + target, req.params.body);
    createRecord(tbl, {device_id:deviceid, device_data:devicedata, timestamp: Math.floor(Date.now()/1000)});
}

function queryAll() {
    var q = ClearBlade.Query({collectionName:tbl});
    promiseQuery(q).then(function(r){
        _resp.success(r);
    })
    .catch(function(err) {
        _resp.error(err);
    });
}

//Update an existing record
function updateRecord(tbl, values) {
    var query = ClearBlade.Query({collectionName:tbl});
    query.equalTo('edgeid', values.item_id);
    query.update(values, statusCallBack);
}

//Create a record
function createRecord(tbl, values) {
    var col = ClearBlade.Collection( {collectionName: tbl } );
    col.create(values, statusCallBack);
}

//Locate a recro by item_id
function findRecord(tbl, values) {
    _record=values; //Global for inner loop
    log("processRecord");
    var query = ClearBlade.Query({collectionName: tbl});
    query.equalTo('item_id', values.item_id);
    d = Q.defer();
	query.fetch(function(err, result) {
        if (err) {
            d.reject(new Error(err));
        } else {
            d.resolve(result.DATA);
        }
    });
    return d.promise;
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

function promiseQuery(query) {
    d = Q.defer();
    var cb = function(err, result) {
        if (err) {
            d.reject(new Error(result));
        } else {
            d.resolve(result.DATA);
        }
    };
    query.fetch(cb);
    return d.promise;
}
