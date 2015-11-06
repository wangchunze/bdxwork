var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('login', { title: '登陆' ,base:'/bi/calendar/'});
});

module.exports = router;
