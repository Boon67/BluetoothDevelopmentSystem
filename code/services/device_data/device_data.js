var _resp, _req;
var _record;
tbl="device_data";
IDFIELD="device_id";

function device_data(req, resp){
    ClearBlade.init({request:req});
    log(req);
    _resp=resp;
    _req=req;
    
    values=req.params;
    //Testing Values
    /*values={
        "GET": true,
        "item_id": "00:0b:57:1a:7a:5a"
    }*/


    if (values.DELETE) {
        resp.success('DELETE');
    }
    else if (values.UPDATE) { //Create or Update based upon values
        log('UPDATE');
        delete values.UPDATE;
        updateRecord(tbl, values);
    }
    else if (values.GET) { //Create or Update based upon values
        log('GET');
        //Put in qLib
        resp.success(findRecords(tbl, values));
    }        
    else if (values.CREATE) { //Create or Update based upon values
        log('CREATE');
        createRecord(tbl, values);
    }
    else { //Read All Data if there is no operation defined
        queryAll();
    }
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

//Locate a record by id field
function findRecords(tbl, values) {
    var query = ClearBlade.Query({collectionName: tbl});
    query.equalTo("device_id", values.item_id);
    query.descending("timestamp");
	query.fetch(function(err, result) {
        if (err) {
            _resp.error(err, result);
        } else {
            log(result)
            _resp.success(result.DATA);
        }
    });
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
