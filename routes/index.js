var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.redirect("/calendar");
  res.redirect("/bi/calendar/login");
  //res.render('index', { title: 'Express' });
});
// 登录页路由
router.get("/login",checkNotLogin);
router.get("/login",function(req,res) {

  res.render("login",{
    title:"用户登入",
    errorInfo:req.session.loginError
  });
});



router.post("/logon",checkNotLogin);
router.post("/logon",function(req,res) {

  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');

  User.get(req.body.username, function(err, user) {

    if (!user) {
      req.flash('errorInfo', '用户不存在');
      req.session.loginError="用户不存在";
      return res.redirect('/bi/calendar/login');
    }
    if (user.Password != password) {
      req.flash('errorInfo', '');
      req.session.loginError="用户密码错误";
      return res.redirect('/bi/calendar/login');
    }
    req.session.user = user;
    req.flash('success', '登入成功');

    res.redirect('/bi/calendar/index');
  });
});

// 登出页路由
router.get("/logout",checkLogin);
router.get("/logout",function(req,res) {
  req.session.user = null;
  req.session.loginError =null;
  req.flash('success', '登出成功');
  res.redirect('/bi/calendar');
});

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登入');
    return res.redirect('/bi/calendar/login');
  }
  next();
}
function checkNotLogin(req, res, next) {

  if (req.session.user) {
    req.flash('error', '已登入');
    return res.redirect('/bi/calendar/index');
  }
  next();
}

module.exports = router;
