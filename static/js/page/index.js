define(function(require, exports, module) { //参数名字不能改
  var minicalendar = require("../plugin/minicalendar");
  require("plugin/xgcalendar");
  require("dailog");
  require("cookie");
  exports.init =function() {
      //动态加载后台数据
      $("#UserList").val( $("#queryUserId").val());
      $("#UserList").change(function(){
          var param=[];
          param.push($("#UserList").val());
          var url = StrFormat("/bi/calendar/index/{0}",param);
          window.location.href=url;
      });

      var readonly=$("#queryUserId").val()!=$("#UserId").val();
      if(readonly){
          //$('#addcalbtn').hide();
          $('#addcalbtn').attr("disabled","disabled");
          $('#addcalbtn').attr("class","");
      }else{
          //$('#addcalbtn').show();
          $('addcalbtn').removeAttr("disabled");
      }

      $("#workstat").click(function() {
           window.location.href="/bi/calendar/report";
      });
      $("#yuliu").click(function() {
          alert("正在建设中");
      });

      $("#workrecord").click(function() {

      });

      $.ajax({
          type: "POST", //
          url: "/bi/calendar/menu",
          data: {'pmenid':''},
          dataType: "text",
          success:function(data) {
              var obj=JSON.parse(data);
              addTopMenu(obj.menuinfo);
          },
          error: function(data) {

          }
      });



     var minical =new minicalendar({
        onchange:datechange
     });
     minical.init("#minical");    
     var op = {
        view: "week",
        theme:1,
        autoload:true, //
        readonly: readonly,
        showday: new Date(),
        EditCmdhandler:edit,
        //DeleteCmdhandler:dcal,
        ViewCmdhandler:view,    
        onWeekOrMonthToDay:wtd,
        onBeforeRequestData: cal_beforerequest,
        onAfterRequestData: cal_afterrequest,
        onRequestDataError: cal_onerror, 
        url: "/bi/calendar/query" ,  
        quickAddUrl: "/bi/calendar/add" ,  
        quickUpdateUrl: "/bi/calendar/update" ,  
        quickDeleteUrl:  "/bi/calendar/delete" //快速删除日程的
        /* timeFormat:" hh:mm t", //t表示上午下午标识,h 表示12小时制的小时，H表示24小时制的小时,m表示分钟
        tgtimeFormat:"ht" //同上 */ 
    };
    var _MH = document.documentElement.clientHeight;
    op.height = _MH-90;
    op.eventItems =[];
    var p = $("#xgcalendarp").bcalendar(op).BcalGetOp();
    if (p && p.datestrshow) {       
        $("#dateshow").text(p.datestrshow);
    }
    $("#addcalbtn").click(function(){
        OpenModalDialog("/bi/calendar/add", { caption: "创建活动", width: 580, height: 360, onclose: function(){
            $("#xgcalendarp").BCalReload();
        }});
    });
    $("#daybtn").click(function() {      
       switchview.call(this,"day");       
    });
    $("#weekbtn").click(function() {      
       switchview.call(this,"week");       
    });
    $("#monthbtn").click(function() {       
       switchview.call(this,"month");       
    });
    $("#prevbtn").click(function(){
        var p = $("#xgcalendarp").BCalPrev().BcalGetOp();
        if (p && p.datestrshow) {
            $("#dateshow").text(p.datestrshow);
        }
    });
    $("#nextbtn").click(function(){
        var p = $("#xgcalendarp").BCalNext().BcalGetOp();
        if (p && p.datestrshow) {
            $("#dateshow").text(p.datestrshow);
        }
    });
    $("#todaybtn").click(function(e) {
        var p = $("#xgcalendarp").BCalGoToday().BcalGetOp();
        if (p && p.datestrshow) {
            $("#dateshow").text(p.datestrshow);
        }
    });
    function switchview (view) {
        $("#viewswithbtn button.current").each(function() {
            $(this).removeClass("current");
        })
        $(this).addClass("current");
        var p = $("#xgcalendarp").BCalSwtichview(view).BcalGetOp();
        if (p && p.datestrshow) {
            $("#dateshow").text(p.datestrshow);
        }
    }
    function datechange(r)
    {
        var p = $("#xgcalendarp").BCalGoToday(r).BcalGetOp();
        if (p && p.datestrshow) {
            $("#dateshow").text(p.datestrshow);
        }
    }
    function cal_beforerequest(type)
    {          
        var t=loadingmsg;
        switch(type)
        {
            case 1:
                t=loadingmsg;
                break;
            case 2:                      
            case 3:  
            case 4:    
                t=processdatamsg;                                   
                break;
        }
        $("#errorpannel").hide();
        $("#loadingpannel").html(t).show();        
    }
    function cal_afterrequest(type)
    {         
        switch(type)
        {
            case 1:
                $("#loadingpannel").hide();
                break;
            case 2:
            case 3:
            case 4:
                $("#loadingpannel").html(sucessmsg);
                window.setTimeout(function(){ $("#loadingpannel").hide();},2000);
            break;
        }              
    }
    function cal_onerror(type,data)
    {
        $("#errorpannel").html(data.Msg);
        $("#errorpannel").show();
        window.setTimeout(function(){  $("#xgcalendarp").BCalReload();},1000);
    }
    function edit(data)
    { 
        if(data)
        {
            var url = StrFormat("/bi/calendar/edit/{0}?start={2}&end={3}&isallday={4}&title={1}",data);           
            OpenModalDialog(url, { caption: "修改活动", width: 580, height: 360, onclose: function(){
                $("#xgcalendarp").BCalReload();
            }});
        }
    }    
    function view(data)
    {              
    }    
    function dcal(data,callback)
    {            
    }
    function wtd(p)
    {
       if (p && p.datestrshow) {
            $("#txtdatetimeshow").text(p.datestrshow);
       }
       $("#viewswithbtn button.current").each(function() {
            $(this).removeClass("current");
        })
        $("#daybtn").addClass("current");             
    }


  }

    exports.index =function() {

        //动态加载后台数据
        $("#UserList").val( $("#queryUserId").val());
        $("#UserList").change(function(){
            var param=[];
            param.push($("#UserList").val());
            var url = StrFormat("/bi/calendar/index/{0}",param);
            window.location.href=url;
        });

        var readonly=$("#queryUserId").val()!=$("#UserId").val();
        if(readonly){
            //$('#addcalbtn').hide();
            $('#addcalbtn').attr("disabled","disabled");
            $('#addcalbtn').attr("class","");
        }else{
            //$('#addcalbtn').show();
            $('addcalbtn').removeAttr("disabled");
        }

        $("#workstat").click(function() {
            window.location.href="/bi/calendar/report";
        });
        $("#yuliu").click(function() {
            alert("正在建设中");
        });

        $("#workrecord").click(function() {

        });

        $.ajax({
            type: "POST", //
            url: "/bi/calendar/menu",
            data: {'pmenid':''},
            dataType: "text",
            success:function(data) {
                var obj=JSON.parse(data);
                addTopMenu(obj.menuinfo);
            },
            error: function(data) {

            }
        });

    }
    //add by wangcz
    function addTopMenu(data){
        var flag=true;
        data.forEach(function(e){
            var btn=$("<button type='button'  id='menu_"+ e.id+"' class='btn btn-info menu1' value='"+e.MenuName+"' "+ ">"+e.MenuName+"</button>");
            if(($.cookie('menuId')==null&&flag==true)|| e.id== $.cookie('menuId')){
                btn=$("<button type='button'  id='menu_"+ e.id+"' class='btn btn-danger menu1' "+ ">"+e.MenuName+"</button>");
            }
            flag=false;
            $("#topMenu").append(btn);
            addBtnEvent("menu_"+e.id, e.id,e.url);
            $("#topMenu").val(e.id);
        })
    }
    function addBtnEvent(menuid,id,url) {
        $("#" + menuid).bind("click", function () {
            $.cookie('menuId', id);
            window.location.href=url;
        });
    }
});