var mysql      = require('mysql');

function GetConnection(usecusformat)
{
    var db = mysql.createConnection({
        host     : "localhost",
        user     : "root",
        password : "",
        database : "test"
    })
    if(usecusformat)
    {
        db.config.queryFormat = function (query, values) {
            if (!values) return query;
            return query.replace(/\:(\w+)/g, function (txt, key) {
                if (values.hasOwnProperty(key)) {
                    return this.escape(values[key]);
                }
                else{
                    return this.escape(null);
                }
            }.bind(this));
        };
    }
    return db;
}
exports.GetCalendar = function(id,userid,datacb,errcb) {
    var db  = GetConnection(true);
    db.connect();
    var sql = "SELECT * FROM workrecord where id=:Id and UserId=:UserId order by StartTime,EndTime";
    db.query(sql,{Id:id,UserId:userid},
        function(err,r){ //数据放回来
            db.end();
            if(err)
            {
                console.log(err);
                if(errcb)
                {
                    errcb(err);
                }
                return;
            }
            if(r && datacb)
            {
                if(datacb)
                    datacb(r);
            }

    });
    //console.log(q.sql);
}
exports.QueryCalendar = function(qstart,qend,userId,zonediff,datacb,errcb) {
    var db  = GetConnection(true);
    db.connect();
    var sql = "SELECT * FROM workrecord where StartTime<:end and EndTime>:start and UserId=:UserId order by StartTime,EndTime";
    db.query(sql,{start:qstart,end:qend,UserId:userId},
        function(err,r){ //数据放回来
            db.end();
            if(err)
            {
                console.log(err);
                if(errcb)
                {
                    errcb(err);
                }
                return;
            }          
            if(r && datacb)
            {        
                if(datacb)
                    datacb(r);                
            }
           
    });
    //console.log(q.sql);
}
exports.QueryCalendarIsUse = function(id,qstart,qend,userId,zonediff,datacb,errcb) {
    var db  = GetConnection(true);
    db.connect();
    var sql = "SELECT * FROM workrecord where " ;
    if(id && id >0){
        sql=sql+"id!=:id and "
    }
    sql=sql+    " StartTime<:end and EndTime>:start and UserId=:UserId order by StartTime,EndTime";
    db.query(sql,{id:id,start:qstart,end:qend,UserId:userId},
        function(err,r){ //数据放回来
            db.end();
            if(err)
            {
                console.log(err);
                if(errcb)
                {
                    errcb(err);
                }
                return;
            }
            if(r && datacb)
            {
                if(datacb)
                    datacb(r);
            }

        });
    //console.log(q.sql);
}
exports.QueryUsers = function(datacb,errcb) {
    var db  = GetConnection(true);
    db.connect();
    var sql = "SELECT * FROM user ";
    db.query(sql,{},
        function(err,r){ //数据放回来
            db.end();
            if(err)
            {
                console.log(err);
                if(errcb)
                {
                    errcb(err);
                }
                return;
            }
            if(r && datacb)
            {
                if(datacb)
                    datacb(r);
            }

        });
    //console.log(q.sql);
}
exports.addCalendar = function(calendar,cb,errcb){
    var db = GetConnection(true);
    db.connect();
    var sql = "INSERT INTO `workrecord`"+
        "(`Subject`,`UserId`,`Description`,`Type`,`StartTime`,`EndTime`"+
    ",`Category`,`Coefficient`,`UpUserId`,`UPTime`,`WorkTimeLength`) "+
    "VALUES "+
        "(:Subject,:UserId,:Description,:RecordType,:StartTime,:EndTime"+
        ",:Category,:Coefficient,:UpUserId,:UPTime,:WorkTimeLength) "
    db.query(sql,calendar,function(err,result){
        db.end();
        if(err)
        {
            console.log(err);
            if(errcb)
            {
                errcb(err);
            }
            return;
        }
        if(cb)
        {
            cb(result.insertId);
        }
    });
    //console.log(q.sql);
}
exports.UpdateCalendar = function(id,userid,calendar,cb,errcb){
    var db = GetConnection();
    db.connect();
    var sql = "UPDATE `workrecord` SET ? WHERE Id="+id+" and UserId='"+userid+"'";
    console.log("calendar : "+JSON.stringify(calendar));
    delete calendar["RecordType"];
    delete calendar["IsAllDayEvent"];
    delete calendar["MasterId"];
    db.query(sql,calendar,function(err,result){
        db.end();
        if(err)
        {
            console.log(err);
            if(errcb)
            {
                errcb(err);
            }
            return;
        }
        if(cb)
        { console.log("cb : "+JSON.stringify(cb));
            var affectedRows = result != null? result.affectedRows:0;
            cb(affectedRows);
        }
    });
    //console.log(q.sql);
}
exports.DeleteCalendar =  function(id,userid,cb,errcb){
    var db = GetConnection();
    db.connect();
    var sql = "DELETE FROM `workrecord` WHERE Id="+id+" and UserId='"+userid+"'";
    db.query(sql,function(err,result){
        db.end();
        if(err)
        {
            console.log(err);
            if(errcb)
            {
                errcb(err);
            }
            return;
        }
        if(cb)
        {
            var affectedRows = result != null? result.affectedRows:0;
            cb(affectedRows);
        }
    });
}