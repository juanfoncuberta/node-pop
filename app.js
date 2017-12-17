var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./routes/index');
var users = require('./routes/users');
var app = express();
var i18n = require("./lib/i18n");


require('./lib/mongooseConnector');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(i18n.init);
//app.use(i18n);
app.use('/', index);
app.use('/users', users);
app.use('/apiv1/anuncio', require('./routes/apiv1/anuncio'));
app.use('/apiv1/usuario', require('./routes/apiv1/usuario'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  if(err.array){
    err.status = 422;
    const infoError = err.array({onlyFirstError:true})[0];
    err.message = isApi(req) ? 
      {message: 'Not valid ',errores:err.mapped()}:
      `Not valid - ${infoError.param} ${infoError.msg}`
  }
  res.status(err.status || 500);
  if(isApi(req)){
    res.json({success:false,error:err.message});
    return;
  }
  console.log('gola');
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

function isApi(req){
     return req.originalUrl.indexOf('apiv')!==0;
  }

module.exports = app;
