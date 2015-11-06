define(function(require, exports, module) { //参数名字不能改

  exports.init =function() {

    if($("#errorInfo").val()!=null&&$("#errorInfo").val()!=""){
        $("#errorpannel").show();
    }else{
        $("#errorpannel").hide();
    }
  }
});