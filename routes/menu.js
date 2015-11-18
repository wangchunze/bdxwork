var nodeExcel = require('excel-export');
var privilegedao = require("../libs/privilegedao");
var util        = require('util');
var viewhelper = require("../libs/viewhelper");
require('date-utils');
var TIMEZONE_INDEX = new Date().getTimezoneOffset()/60 * -1;

exports.report = function(req,res){
    res.render('report',{title:req.session.user.UserName+"，您好"});

}
exports.query = function(req,res){

    var pmenid =req.body.pmenid; // 当前是那一天

    var temp        = {} ;
    temp.error       = null;
    temp.issort      = true;

    privilegedao.queryMenu(pmenid,req.session.user.Id,function(dbdata){
        temp.menuinfo = [];
        for(var i=0,l=dbdata.length;i<l;i++)
        {   var menu={};
            menu.id=dbdata[i].id;
            menu.MenuCode=dbdata[i].MenuCode;
            menu.MenuName=dbdata[i].MenuName;
            menu.url=dbdata[i].url;
            temp.menuinfo.push(menu);
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