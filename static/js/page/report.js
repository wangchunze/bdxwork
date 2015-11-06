
define(function(require, exports, module) {
    exports.init =function() {




        $("#workrecord").click(function() {
            window.location.href="/bi/calendar/index";
        });

        $("#workstat").click(function() {

        });
        $("#yuliu").click(function() {
            alert("正在建设中");
        });


        $("#workstat_export").click(function() {
            window.location.href="/bi/calendar/excel"
        });

        $.ajax({
            type: "POST", //
            url: "/bi/calendar/report",
            data: {'starttime':'2015-11-01 :00:00:00','endtime':'2015-11-30 :00:00:00'},
            dataType: "text",
            success:function(data) {

                var obj=JSON.parse(data);

                statBydate(obj.stateinfo);
            },
            error: function(data) {

            }
        });

        $("#statBydate").click(function() {
            $.ajax({
                type: "POST", //
                url: "/bi/calendar/report",
                data: {'starttime':'2015-11-01 :00:00:00','endtime':'2015-11-30 :00:00:00'},
                dataType: "text",
                success:function(data) {
                    var obj=JSON.parse(data);

                    statBydate(obj.stateinfo);
                },
                error: function(data) {

                }
            });
        });

    }
    function statBydate(data){

        var myChart = echarts.init(document.getElementById('main'));
        var days=new Array();
        var worklength=[];
        data.forEach(function(e){
            days.push(e.days) ;
            worklength.push(Number(e.timelength));
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