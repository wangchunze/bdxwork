//引进 node-schedule
var schedule = require('node-schedule');
var reportdao = require("../libs/reportdao");
var nodemailer = require("nodemailer");
var log = require("../static/js/logHelper").helper;
var async = require('async');

exports.schedule = function(){
    var smtpTransport = nodemailer.createTransport("SMTP",{
        host: "smtp.qq.com", // 主机
        secureConnection: true, // 使用 SSL
        port: 465, // SMTP 端口
        auth: {
            user: "84521982@qq.com", // 账号
            pass: "zafpwhfhanlkbjig" // 密码
        }
    });

    //初始化并设置定时任务的时间
    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [1, new schedule.Range(2, 5)];
    rule.hour = 16;
    rule.minute = 30;
    rule.second=0;
    var j = schedule.scheduleJob(rule, function(){
        //发邮件
        var todayDate=new Date();
        var startDate=todayDate.getFullYear()+"-"+(todayDate.getMonth()+1)+"-"+todayDate.getDate();
        var endDate=todayDate.getFullYear()+"-"+(todayDate.getMonth()+1)+"-"+todayDate.getDate();
        startDate=startDate+' 00:00:00';
        endDate=endDate+' 23:59:59';
        reportdao.StateAll(startDate,endDate,null,function(dbdata){
            var datas=[];
            for(var i=0,l=dbdata.length;i<l;i++)
            {   var statinfo={};
                statinfo.userid=dbdata[i].id;
                statinfo.username=dbdata[i].UserName;
                statinfo.hours=dbdata[i].hours;
                statinfo.email=dbdata[i].email;
                //判断工作量，如果小于6，发送邮件
                if(statinfo.hours<5){
                    datas.push(statinfo);
                }
            }

            async.mapSeries(datas, function(e, callback) {
                if(e.email){
                    var mailOptions = {
                        from: "BDXWORK<84521982@qq.com>",       // 发送地址
                        to: e.email, // 接收列表
                        subject: "BDX工作量提交提醒-"+todayDate.getFullYear()+"-"+(todayDate.getMonth()+1)+"-"+todayDate.getDate(),                             // 邮件主题
                        text: "Hello ，"+e.username+":您今天提价工工作量"+e.hours+"小时，请按时提交，谢谢。",                          // 文本内容
                        html: "Hello  ，"+e.username+"<br>您今天提交工作量"+e.hours+"小时，请按时提交，谢谢。<br><font color='red'>每天下午4点半检查工作量情况，不足5小时自动发送此邮件。</font><br><font color='red'>此为系统自动发送，请勿回复</font>"
                    }

                    /*smtpTransport.sendMail(mailOptions, function(error, response){
                        if(error){
                            log.writeErr(error);
                        }else{
                            log.writeInfo("邮件已经发送: " +e.username+":"+ response.message);
                        }
                        //smtpTransport.close();
                        sleep(5000);//间隔5秒，防止频繁发邮件限制
                        callback();
                    });*/
                }
            }, function(err, ress) {

            });
        },function(err) {

        });
    });
    function sleep(milliSeconds) {
        var startTime = new Date().getTime();
        while (new Date().getTime() < startTime + milliSeconds);
    };
}


