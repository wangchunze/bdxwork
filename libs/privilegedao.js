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
exports.queryMenu = function(pmenuid,userId,datacb,errcb) {
    var db  = GetConnection(true);
    db.connect();
    var sql ="";
    if(pmenuid && pmenuid >0){
        sql ="select m.id id,m.MenuCode MenuCode,m.MenuName MenuName,m.url url from user u,menu m,role_menu rm where 1=1 "+
        " and  m.parentmenuid =:pmenuid and u.Role=rm.RoleId and rm.MenuId=m.Id "+
        " and u.id=:UserId "+
        " union "+
        " select  m.id id,m.MenuCode MenuCode,m.MenuName MenuName,m.url url  from user u,menu m,deptmenu dm "+
        " where m.parentmenuid =:pmenuid and   u.DeptCode=dm.deptid and dm.MenuId=m.id "+
        " and u.id=:UserId ;";
    }else{
        sql ="select m.id id,m.MenuCode MenuCode,m.MenuName MenuName,m.url url from user u,menu m,role_menu rm where 1=1 "+
        " and m.parentmenuid is null and u.Role=rm.RoleId and rm.MenuId=m.Id "+
        " and u.id=:UserId "+
        " union "+
        " select  m.id id,m.MenuCode MenuCode,m.MenuName MenuName,m.url url  from user u,menu m,deptmenu dm "+
        " where m.parentmenuid is null and   u.DeptCode=dm.deptid and dm.MenuId=m.id "+
        " and u.id=:UserId ;";
    }
    console.log("sql :"+sql);
    db.query(sql,{pmenuid:pmenuid,UserId:userId},
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

exports.WorkRecord = function(qstart,qend,userId,datacb,errcb) {
    var db  = GetConnection(true);
    db.connect();
    var sql ="select workrecord.id,DATE_FORMAT(UpTime, '%Y-%m-%d %H:%i:%s') UpTime,DATE_FORMAT(StartTime, '%Y-%m-%d %H:%i:%s') StartTime,DATE_FORMAT(EndTime, '%Y-%m-%d %H:%i:%s') EndTime,Subject,Description,Type,UserName,WorkTimeLength/3600 WorkTimeLength,Coefficient,(WorkTimeLength/3600)*Coefficient wc from workrecord,user where workrecord.userid=user.id and  StartTime<=:end and endtime>=:start and userid =:UserId ";
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

