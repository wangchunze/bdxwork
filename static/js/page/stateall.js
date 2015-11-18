
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

                $("#leftmenu").append(btn);
                addBtnEvent("menu_"+e.id,e.url);
                $("#topMenu").val(e.id);
            })
        }
        function addBtnEvent(id,url) {
            $("#" + id).bind("click", function () {
                window.location.href=url;
            });
        }

        $("#UserList").hide();
        $("#workstat_export").click(function() {
            window.location.href="/bi/calendar/excel"
        });


        $.ajax({//默认查询
            type: "POST", //
            url: "/bi/calendar/stat_all",
            data: {'starttime':$("#tbStartDate").val()+' 00:00:00','endtime':$("#tbEndDate").val()+' 23:59:59','isAll':$("#isAll").val()},
            dataType: "text",
            success:function(data) {
                var obj=JSON.parse(data);
                statAll(obj.stateinfo);
            },
            error: function(data) {

            }
        });

        $("#statAll").click(function() {
            $.ajax({
                type: "POST", //
                url: "/bi/calendar/stat_all",
                data: {'starttime':$("#tbStartDate").val()+' 00:00:00','endtime':$("#tbEndDate").val()+' 23:59:59','isAll':$("#isAll").val()},
                dataType: "text",
                success:function(data) {
                    var obj=JSON.parse(data);
                    statAll(obj.stateinfo);
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
    function statAll(data){

        var myChart = echarts.init(document.getElementById('m'));

        var days=new Array();
        var worklength=[];
        data.forEach(function(e){
            days.push(e.username) ;
            worklength.push(Number(e.hours));
        })

        myChart.setOption({
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['工作量']
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : days
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    splitArea : {show : true}
                }
            ],
            series : [
                {
                    name:'工作量',
                    type:'bar',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    color: '#800080'
                                }
                            }
                        }
                    },
                    data: worklength
                },

            ]
        });
    }

});