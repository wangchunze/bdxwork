var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var  i18n = require('i18n');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var routes = require('./routes/index');
var login = require('./routes/login');
var validator=require('validator');
var install = require('./routes/install');
var users = require('./routes/users');
var calendar = require('./routes/calendar');
var excel = require('./routes/excel');
var cookieSession = require('cookie-session');

i18n.configure({
  locales:['zh-cn','en','en-us'],
  extension: '.json',
  directory: __dirname + '/locales',
  register: global,
  updateFiles: false
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var friends = 10
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/bi/calendar",express.static(path.join(__dirname, 'static')));
app.use(flash());
//app.use(session({secret: 'blog.fens.me', cookie: { maxAge: 600000 }}));
app.use(cookieSession({
  name: 'session',     //  he name of the cookie to set
keys: ['key1', 'key2']
}));


app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


//app.use('/', login);
app.use('/bi/calendar/users', users);

function checkLogin(req, res, next) {
  console.log("!!!!!!!!!!!!!");

  if (!req.session.user) {
    req.flash('error', '未登入');
    console.log("!!11111!!!!!!!!!!!");
    return res.redirect('/bi/calendar/login');
  }
  console.log(req.session.user.Account);
  next();
}

app.get('/bi/calendar/excel',excel.test);
app.get('/bi/calendar/report',excel.report);
app.use('/bi/calendar', routes);
app.get('/bi/calendar',checkLogin);
app.get('/bi/calendar/index',checkLogin);
app.get('/bi/calendar/index/:userid', calendar.index);
app.get('/bi/calendar/index/:userid',checkLogin);
app.get('/bi/calendar/index', calendar.index);
app.get('/bi/calendar/add', calendar.editview);
app.get('/bi/calendar/edit/:id', calendar.editview);

app.use('/bi/calendar/install', install);
app.use('/bi/calendar/query', calendar.query);
app.use('/bi/calendar/add', calendar.add);
app.use('/bi/calendar/update', calendar.update);
app.use('/bi/calendar/delete', calendar.delete);
app.use('/bi/calendar/save/:id', calendar.save);
app.use('/bi/calendar/report', excel.query);
app.use('/bi/calendar',i18n.init);

app.use(function(req, res, next){
  res.locals.user = req.session.user;
  res.locals.post = req.session.post;
  var error = req.flash('error');
  res.locals.error = error.length ? error : null;
  var success = req.flash('success');
  res.locals.success = success.length ? success : null;
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
