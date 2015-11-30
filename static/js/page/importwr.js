
define(function(require, exports, module) {
    require("cookie");
    require("validate");
    require("datepicker");
    require("dropdown");
    exports.init =function() {
        $("#UserList").hide();
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
        $("#example_export").click(function() {
            window.location.href="/bi/calendar/excel/WorkRecord.xlsx";
        });

    }


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
});