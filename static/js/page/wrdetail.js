
define(function(require, exports, module) {
    require("cookie");
    require("validate");
    require("datepicker");
    require("dropdown");
    exports.init =function() {

        $("#tbTimeZone").val(new Date().getTimezoneOffset()/60 * -1);

        var todayDate=new Date();

        $("#tbStartDate").datepicker({
            picker: "<img class='picker' style='float:left;' align='middle' src='/bi/calendar/image/icon/s.gif' alt=''/>",
            showtime: false });

        $("#tbStartDate").val(todayDate.getFullYear()+"-"+(todayDate.getMonth()+1)+"-01");

        $("#tbEndDate").datepicker({
            picker: "<img class='picker' style='float:left;' align='middle' src='/bi/calendar/image/icon/s.gif' alt=''/>",
            showtime: false });

        $("#tbEndDate").val(todayDate.getFullYear()+"-"+(todayDate.getMonth()+1)+"-"+todayDate.getDate());

        $.ajax({
            type: "POST", //
            url: "/bi/calendar/menu",
            data: {'pmenid':$.cookie('menuId')},
            dataType: "text",
            success:function(data) {
                var obj=JSON.parse(data);
                addLeftMenu(obj.menuinfo);
            },
            error: function(data) {
            }
        });
        //add by wangcz
        function addLeftMenu(data){
            data.forEach(function(e){
                var btn=$("<button type='button'  id='menu_"+ e.id+"' style='margin-top: 5px;width:150px' class='btn btn-block' "+ ">"+e.MenuName+"</button>");
                if("menu_"+e.id== $.cookie('level2menuId')){
                    btn=$("<button type='button'  id='menu_"+ e.id+"' style='margin-top: 5px;width:150px' class='btn btn-danger' "+ ">"+e.MenuName+"</button>");
                }

                $("#leftmenu").append(btn);
                addBtnEvent("menu_"+e.id,e.url);
                $("#topMenu").val(e.id);
            })
        }
        function addBtnEvent(id,url) {
            $("#" + id).bind("click", function () {
                $.cookie('level2menuId',id);
                window.location.href=url;
            });
        }

        $("#UserList").hide();
        $("#workstat_export").click(function() {
            window.location.href="/bi/calendar/excel/"+$("#tbStartDate").val()+' 00:00:00'+"/"+$("#tbEndDate").val()+' 23:59:59'+"/"+$("#isAll").val();
            /*$.ajax({
                type: "GET", //
                url: "/bi/calendar/excel",
                data: {'starttime':$("#tbStartDate").val()+' 00:00:00','endtime':$("#tbEndDate").val()+' 23:59:59'},
                dataType: "text",
                success:function(data) {

                },
                error: function(data) {

                }
            });*/
        });


        $("#statAll").click(function() {
            $("#tableInfo  tr:not(:first)").empty()
            $.ajax({
                type: "POST", //
                url: "/bi/calendar/wr_detail",
                data: {'starttime':$("#tbStartDate").val()+' 00:00:00','endtime':$("#tbEndDate").val()+' 23:59:59','isAll':$("#isAll").val()},
                dataType: "text",
                success:function(data) {

                    var obj=JSON.parse(data);
                    obj.stateinfo.forEach(function(e){

                        addTr2("tableInfo",-1,e);
                    })

                },
                error: function(data) {

                }
            });
        });

    }
    function getHM(date)
    {
        var hour =date.getHours();
        var minute= date.getMinutes();
        var ret= (hour>9?hour:"0"+hour)+":"+(minute>9?minute:"0"+minute) ;
        return ret;
    }

    function addTr2(tab,row,data){
        if(!data.Description){
            data.Description="";
        }
        var types={"1":"日常维护","2":"项目维护","3":"故障处理","4":"学习培训","5":"技术创新",
            "6":"需求开发","7":"项目开发","8":"工作值班","9":"系统优化","10":"其他开发",
            "11":"临时提数","12":"口径确认"
        }
        data.Type=types[data.Type];

        var trHtml="<tr onmouseover=\"this.style.backgroundColor='#ffff66';\" onmouseout=\"this.style.backgroundColor='#d4e3e5';\">"
        trHtml=trHtml+"<td>"+data.UpTime+"</td>";
        trHtml=trHtml+"<td>"+data.StartTime+"</td>";
        trHtml=trHtml+"<td>"+data.EndTime+"</td>";
        trHtml=trHtml+"<td>"+data.Subject+"</td>";
        trHtml=trHtml+"<td>"+data.Description+"</td>";
        trHtml=trHtml+"<td>"+data.Type+"</td>";
        trHtml=trHtml+"<td>"+data.UserName+"</td>";
        trHtml=trHtml+"<td>"+data.WorkTimeLength+"</td>";
        trHtml=trHtml+"<td>"+data.Coefficient+"</td>";
        trHtml=trHtml+"<td>"+data.wc+"</td>";
        trHtml=trHtml+"</tr>";
        addTr(tab, row, trHtml);
    }
    function addTr(tab, row, trHtml){
        //获取table最后一行 $("#tab tr:last")
        //获取table第一行 $("#tab tr").eq(0)
        //获取table倒数第二行 $("#tab tr").eq(-2)
        var $tr=$("#"+tab+" tr").eq(row);
        if($tr.size()==0){
            return;
        }
        $tr.after(trHtml);
    }
});