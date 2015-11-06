var nodeExcel = require('excel-export');
var calendardao = require("../libs/reportdao");
var util        = require('util');
var viewhelper = require("../libs/viewhelper");
require('date-utils');
var TIMEZONE_INDEX = new Date().getTimezoneOffset()/60 * -1;
exports.test = function(req,res){

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

    var starttime ='2015-11-01 :00:00:00'; // 当前是那一天
    var endtime = '2015-11-30 :00:00:00';
    var temp        = {} ;
    temp.error       = null;
    temp.issort      = true;
    calendardao.WorkRecord(starttime,endtime,req.session.user.Id,function(dbdata){
        console.log(JSON.stringify(dbdata));
        temp.stateinfo = [];
        for(var i=0,l=dbdata.length;i<l;i++)
        {
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
        res.setHeader("Content-Disposition", "attachment; filename=" + "1212.xlsx");
        res.end(result, 'binary');

    },function(err) {

    });

}

exports.report = function(req,res){
    res.render('report',{title:req.session.user.UserName+"，您好"});

}
exports.query = function(req,res){

    var starttime =req.body.starttime; // 当前是那一天
    var endtime = req.body.endtime;
    var temp        = {} ;
    temp.error       = null;
    temp.issort      = true;

    calendardao.StateWorkByDate(starttime,endtime,req.session.user.Id,function(dbdata){
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