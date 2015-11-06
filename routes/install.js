var installdb  = require('../libs/installdb');


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    installdb.installdb();
    res.send("db setup complete!");
});

module.exports = router;
