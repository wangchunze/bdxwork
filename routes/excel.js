var nodeExcel = require('excel-export');
var reportdao = require("../libs/reportdao");
var calendardao = require("../libs/calendardao");
var util        = require('util');
var viewhelper = require("../libs/viewhelper");
var i18n = require('i18n');
require('date-utils');
var TIMEZONE_INDEX = new Date().getTimezoneOffset()/60 * -1;
exports.test = function(req,res){
    var starttime =req.params.starttime; // 当前是那一天
    var endtime = req.params.endtime;
    var isAll = req.params.isAll;
    var conf ={};
    //conf.stylesXmlFile = "routes/styles.xml";
    conf.cols = [{//编号
        caption:'编号',
        type:'number',
        width:10
    },{//填写时间
        caption:'填写时间',
        type:'timestamp',
        width:20
    },{//开始时间
        caption:'开始时间',
        type:'timestamp',
        width:20
    },{//结束时间
        caption:'结束时间',
        type:'timestamp',
        width:20
    },{//工作标题
        caption:'工作标题',
        captionStyleIndex: 1,
        type:'string',
        width:15
    },{//工作描述
        caption:'工作描述',
        captionStyleIndex: 1,
        type:'string',
        width:15
    },{//工作类型
        caption:'工作类型',
        type:'number',
        width:10
    },{//工作负责人
        caption:'工作负责人',
        captionStyleIndex: 1,
        type:'string',
        width:15
    },{//工时
        caption:'工时',
        type:'number',
        width:10
    },{//工作系数
        caption:'工作系数',
        type:'number',
        width:10
    },{//工时合计
        caption:'工时合计',
        type:'number',
        width:10
    }];

    var temp        = {} ;
    temp.error       = null;
    temp.issort      = true;
    reportdao.WorkRecord(starttime,endtime,req.session.user.Id,isAll,function(dbdata){
        console.log("WorkRecord :"+JSON.stringify(dbdata));
        temp.stateinfo = [];

        var types={"1":"日常维护","2":"项目维护","3":"故障处理","4":"学习培训","5":"技术创新",
            "6":"需求开发","7":"项目开发","8":"工作值班","9":"系统优化","10":"其他开发",
            "11":"临时提数","12":"口径确认"
        }

        for(var i=0,l=dbdata.length;i<l;i++)
        {  if(!dbdata[i].Description){
            dbdata[i].Description="";
            }
            dbdata[i].Type=types[dbdata[i].Type];
            temp.stateinfo.push([
                dbdata[i].id,
                dbdata[i].UpTime,
                dbdata[i].StartTime,
                dbdata[i].EndTime,
                dbdata[i].Subject,dbdata[i].Description,dbdata[i].Type,
            dbdata[i].UserName,
            dbdata[i].WorkTimeLength,
            dbdata[i].Coefficient,
            dbdata[i].wc
            ]);
        }

        conf.rows =temp.stateinfo;
        var result = nodeExcel.execute(conf);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + new Date().getTime()+".xlsx");
        res.end(result, 'binary');

    },function(err) {

    });

}

exports.report = function(req,res){

    //console.log(i18n.getLocale());
    var userid=req.params.userid;
    if(userid !=null)
    {   req.session.quser={};
        req.session.quser.userId=userid;
    }else{
        req.session.quser={};
        req.session.quser.userId=req.session.user.Id;
    }
    var lang = req.query.lang;
    if(lang=='en-us')
    {
        i18n.setLocale('en-us');
    }
    else
    {
        i18n.setLocale('zh-cn');
    }

    //查询用户
    var users = [];
    calendardao.QueryUsers(function(dbdata){

        for(var i=0,l=dbdata.length;i<l;i++)
        {   var user={};
            user.Id=dbdata[i].Id;
            user.UserName=dbdata[i].UserName;
            users.push(user);
        }
        console.log("users :"+JSON.stringify(users));
        res.render('report',{title:req.session.user.UserName+"，您好",users:users,quserid:req.session.quser.userId,userid:req.session.user.Id});
    },function(err) {

    });
    //res.render('report',{title:req.session.user.UserName+"，您好"});

}
exports.stat_all = function(req,res){

    var userid=req.params.userid;
    if(userid !=null)
    {   req.session.quser={};
        req.session.quser.userId=userid;
    }else{
        req.session.quser={};
        req.session.quser.userId=req.session.user.Id;
    }
    var lang = req.query.lang;
    if(lang=='en-us')
    {
        i18n.setLocale('en-us');
    }
    else
    {
        i18n.setLocale('zh-cn');
    }

    //查询用户
    var users = [];
    calendardao.QueryUsers(function(dbdata){

        for(var i=0,l=dbdata.length;i<l;i++)
        {   var user={};
            user.Id=dbdata[i].Id;
            user.UserName=dbdata[i].UserName;
            users.push(user);
        }
        console.log("users :"+JSON.stringify(users));
        res.render('stat_all',{title:req.session.user.UserName+"，您好",users:users,quserid:req.session.quser.userId,userid:req.session.user.Id});
    },function(err) {
    });
}
exports.wrdetail = function(req,res){

    var userid=req.params.userid;
    if(userid !=null)
    {   req.session.quser={};
        req.session.quser.userId=userid;
    }else{
        req.session.quser={};
        req.session.quser.userId=req.session.user.Id;
    }
    var lang = req.query.lang;
    if(lang=='en-us')
    {
        i18n.setLocale('en-us');
    }
    else
    {
        i18n.setLocale('zh-cn');
    }

    //查询用户
    var users = [];
    calendardao.QueryUsers(function(dbdata){

        for(var i=0,l=dbdata.length;i<l;i++)
        {   var user={};
            user.Id=dbdata[i].Id;
            user.UserName=dbdata[i].UserName;
            users.push(user);
        }
        console.log("users :"+JSON.stringify(users));
        res.render('wr_detail',{title:req.session.user.UserName+"，您好",users:users,quserid:req.session.quser.userId,userid:req.session.user.Id,isAll:"false"});
    },function(err) {
    });
}
exports.wralldetail = function(req,res){

    var userid=req.params.userid;
    if(userid !=null)
    {   req.session.quser={};
        req.session.quser.userId=userid;
    }else{
        req.session.quser={};
        req.session.quser.userId=req.session.user.Id;
    }
    var lang = req.query.lang;
    if(lang=='en-us')
    {
        i18n.setLocale('en-us');
    }
    else
    {
        i18n.setLocale('zh-cn');
    }

    //查询用户
    var users = [];
    calendardao.QueryUsers(function(dbdata){

        for(var i=0,l=dbdata.length;i<l;i++)
        {   var user={};
            user.Id=dbdata[i].Id;
            user.UserName=dbdata[i].UserName;
            users.push(user);
        }
        console.log("users :"+JSON.stringify(users));
        res.render('wr_detail',{title:req.session.user.UserName+"，您好",users:users,quserid:req.session.quser.userId,userid:req.session.user.Id,isAll:"true"});
    },function(err) {
    });
}
exports.query = function(req,res){

    var starttime =req.body.starttime; // 当前是那一天
    var endtime = req.body.endtime;
    var temp        = {} ;
    temp.error       = null;
    temp.issort      = true;

    reportdao.StateWorkByDate(starttime,endtime,req.session.user.Id,function(dbdata){
        temp.stateinfo = [];
        for(var i=0,l=dbdata.length;i<l;i++)
        {   var statinfo={};
            statinfo.userid=dbdata[i].userid;
            statinfo.days=dbdata[i].days;
            statinfo.timelength=dbdata[i].times;
            temp.stateinfo.push(statinfo);
        }
        var respstr =JSON.stringify(temp);
        respstr = respstr.replace(/\//ig,"\\\/");
        console.log("respstr : "+respstr);
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(respstr);

    },function(err) {
        console.log(JSON.stringify(err));
        ret.error = {"ErrorCode":"DBError","ErrorMsg":__("dberror")};
        res.json(ret);
    });

}
exports.statall = function(req,res){

    var starttime =req.body.starttime; // 当前是那一天
    var endtime = req.body.endtime;
    var temp        = {} ;
    temp.error       = null;
    temp.issort      = true;

    reportdao.StateAll(starttime,endtime,req.session.user.Id,function(dbdata){
        temp.stateinfo = [];
        for(var i=0,l=dbdata.length;i<l;i++)
        {   var statinfo={};
            statinfo.userid=dbdata[i].userid;
            statinfo.username=dbdata[i].UserName;
            statinfo.hours=dbdata[i].hours;
            temp.stateinfo.push(statinfo);
        }
        var respstr =JSON.stringify(temp);
        console.log("StateAll : "+respstr);
        respstr = respstr.replace(/\//ig,"\\\/");
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(respstr);

    },function(err) {
        console.log(JSON.stringify(err));
        ret.error = {"ErrorCode":"DBError","ErrorMsg":__("dberror")};
        res.json(ret);
    });

}
exports.wr_detail = function(req,res){

    var starttime =req.body.starttime; // 当前是那一天
    var endtime = req.body.endtime;
    var isAll= req.body.isAll;

    var temp        = {} ;
    temp.error       = null;
    temp.issort      = true;

    reportdao.WorkRecord(starttime,endtime,req.session.user.Id,isAll,function(dbdata){
        temp.stateinfo = [];
        for(var i=0,l=dbdata.length;i<l;i++)
        {
            var statinfo={};
            statinfo.id=dbdata[i].id;
            statinfo.UpTime=dbdata[i].UpTime;
            statinfo.StartTime=dbdata[i].StartTime;
            statinfo.EndTime=dbdata[i].EndTime;
            statinfo.Subject=dbdata[i].Subject;
            statinfo.Description=dbdata[i].Description;
            statinfo.Type=dbdata[i].Type;
            statinfo.UserName=dbdata[i].UserName;
            statinfo.WorkTimeLength=dbdata[i].WorkTimeLength;
            statinfo.Coefficient=dbdata[i].Coefficient;
            statinfo.wc=dbdata[i].wc;
            temp.stateinfo.push(statinfo);
        }
        var respstr =JSON.stringify(temp);
        console.log("WR_Detail : "+respstr);
        respstr = respstr.replace(/\//ig,"\\\/");
        res.set('Content-Type', 'application/json; charset=utf-8');
        res.send(respstr);

    },function(err) {
        console.log(JSON.stringify(err));
        ret.error = {"ErrorCode":"DBError","ErrorMsg":__("dberror")};
        res.json(ret);
    });
}