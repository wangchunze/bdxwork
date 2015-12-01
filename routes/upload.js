var express = require('express');
var multer = require('multer');
var fs = require('fs');
var router = express.Router();
var upload = multer({dest: './public/uploads'});
var type = upload.single('file');
var xlsx = require("node-xlsx");
var i18n = require('i18n');
var async = require('async');

var calendardao = require("../libs/calendardao");
router.post('/file-upload', type, function(req, res){

    if(!req.file){
        var importinfo=[];
        importinfo.push("请选择文件！")
        req.flash('importinfo', importinfo);
        return  res.redirect('/bi/calendar/importwr');
    }
    var tmp_path = req.file.path;
    var target_path = './public/uploads/' + req.file.originalname;
    /*fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // 删除临时文件夹文件,
        fs.unlink(tmp_path, function() {
            if (err) throw err;
        });
    });*/
    //读excel
    var list = xlsx.parse(tmp_path);
    var wr=list[0].data;
    var datas=[];
    var types={"1":"日常维护","2":"项目维护","3":"故障处理","4":"学习培训","5":"技术创新",
        "6":"需求开发","7":"项目开发","8":"工作值班","9":"系统优化","10":"其他开发",
        "11":"临时提数","12":"口径确认"
    }
    var isUseInExcelFlag=false;
    var isUseInDatabaseFlag=false;
    var importinfo=[];
    for(var i=1;i<wr.length;i++){
        var data      = {};
        data.Subject =wr[i][2];
        for(var key in types){
            if(types[key]==wr[i][4]){
                data.RecordType =key;
            }
        }
        data.Category = "1";
        data.Description =wr[i][3];
        data.Coefficient = wr[i][5];
        data.UserId =req.session.user.Id;
        data.UPTime=new Date();
        data.StartTime =new Date(wr[i][0]) ;
        data.EndTime =new Date(wr[i][1]);
        data.WorkTimeLength=(data.EndTime-data.StartTime)/1000;
        var startDate=data.StartTime.getYear()+"-"+(data.StartTime.getMonth()+1)+"-"+data.StartTime.getDate();
        var endDate=data.EndTime.getYear()+"-"+(data.EndTime.getMonth()+1)+"-"+data.EndTime.getDate();
        if(startDate!=endDate){
            importinfo.push("待导入数据中第"+i+"条数据存在跨天情况");
        }
        if(data.Subject==null || data.Coefficient==null
            || data.StartTime==null || data.EndTime==null ){
            importinfo.push("待导入数据中第"+i+"条数据不全");
         }
        if(datas.length>0){//验证本次插入数据是否有时间交叉
           for(var da in datas){
               if(datas[da].StartTime<data.EndTime&&datas[da].EndTime>data.StartTime){
                   isUseInExcelFlag=true;
                   importinfo.push("待导入数据中第"+i+"条数据与第"+(Number(da)+1)+"条数据时间冲突");
               }
           }
        }

        datas.push(data);
    }
    var n=0;
    var count=0;
    async.mapSeries(datas, function(item, callback) {
        queryIsUse(item, function(r) {
            n=n+1;
            if(r=="1"){
                isUseInDatabaseFlag=true;
                importinfo.push("待导入数据中第"+n+"条数据,在系统中有时间冲突的记录");
            }
            callback();
        });
    }, function(err, ress) {
        if(importinfo.length>0){
            req.flash('importinfo', importinfo);
            return  res.redirect('/bi/calendar/importwr');
        }else{
            async.mapSeries(datas, function(item, callback) {
                insertWr(item, function(r) {
                    if(r=="1"){
                        count=count+1;
                    }
                    callback();
                });
            }, function(err, ress) {
                importinfo.push("成功导入"+count+"条数据成功！");
                req.flash('importinfo', importinfo);
                return  res.redirect('/bi/calendar/importwr');
            });
        }
    });

    function queryIsUse(data, callback) {
        calendardao.QueryCalendarIsUse(null,data.StartTime,data.EndTime,req.session.user.Id,null,function(dbdata){
            if(dbdata.length>0){
                callback(1);
            }else{
                callback(0);
            }
        },function(err) {

        });
    }
    function insertWr(data, callback) {
        calendardao.addCalendar(data,function(dbdata){
            callback(1);
        },function(err) {
            callback(0);
        });
    }
});


module.exports = router;