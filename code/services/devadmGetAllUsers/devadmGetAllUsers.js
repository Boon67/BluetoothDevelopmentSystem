function devadmGetAllUsers(req, resp){
    ClearBlade.init({request:req});
    var user = ClearBlade.User();
    // Right Now sending all possible users, but one might want to restrict later on
    user.allUsers(ClearBlade.Query({}), function(err, r){
        if(err){
            resp.error(r);
        }
        resp.success(r);
    })  
}