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
exports.StateWorkByDate = function(qstart,qend,userId,datacb,errcb) {
    var db  = GetConnection(true);
    db.connect();
    var sql ="select userid,DATE_FORMAT(starttime,'%Y%m%d') days,format(sum(worktimelength*Coefficient)/3600,2)  times  from workrecord where StartTime<=:end and endtime>=:start and userid =:UserId group by days,userid";
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
}
exports.StateAll = function(qstart,qend,userId,datacb,errcb) {
    var db  = GetConnection(true);
    db.connect();
    var sql ="select wr.userid,u.UserName, format(sum(worktimelength*Coefficient)/3600,2)  hours  from  workrecord wr,user u where u.id=wr.UserId and StartTime<=:end and endtime>=:start group by wr.userid,u.UserName ;";
    db.query(sql,{start:qstart,end:qend},
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
}
exports.WrDetail = function(qstart,qend,userId,datacb,errcb) {
    var db  = GetConnection(true);
    db.connect();
    var sql ="select wr.userid,u.UserName, format(sum(worktimelength*Coefficient)/3600,2)  hours  from  workrecord wr,user u where u.id=wr.UserId and StartTime<=:end and endtime>=:start group by wr.userid,u.UserName ;";
    db.query(sql,{start:qstart,end:qend},
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
}
exports.WorkRecord = function(qstart,qend,userId,isAll,datacb,errcb) {
    var db  = GetConnection(true);
    db.connect();
    var sql="";
    if(isAll=="false"){
        sql ="select workrecord.id,DATE_FORMAT(UpTime, '%Y-%m-%d %H:%i:%s') UpTime,DATE_FORMAT(StartTime, '%Y-%m-%d %H:%i:%s') StartTime,DATE_FORMAT(EndTime, '%Y-%m-%d %H:%i:%s') EndTime,Subject,Description,Type,UserName,WorkTimeLength/3600 WorkTimeLength,Coefficient,(WorkTimeLength/3600)*Coefficient wc from workrecord,user where workrecord.userid=user.id and  StartTime<=:end and endtime>=:start and userid =:UserId ";
    }else{
        sql ="select workrecord.id,DATE_FORMAT(UpTime, '%Y-%m-%d %H:%i:%s') UpTime,DATE_FORMAT(StartTime, '%Y-%m-%d %H:%i:%s') StartTime,DATE_FORMAT(EndTime, '%Y-%m-%d %H:%i:%s') EndTime,Subject,Description,Type,UserName,WorkTimeLength/3600 WorkTimeLength,Coefficient,(WorkTimeLength/3600)*Coefficient wc from workrecord,user where workrecord.userid=user.id and  StartTime<=:end and endtime>=:start ";
    }

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
}

