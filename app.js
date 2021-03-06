var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var api = require('./routes/api');
var index = require('./routes/index');
var websocketServer=require('./servers/websocketServer');
var app = express();
const swaggerJSDoc = require('swagger-jsdoc');

var oauth = require('./routes/oauth');

const options = {
  definition:{
    info:{
      title:'Sync_RESTful API',
      version:'1.0.0'
    },
  },
  host:'localhost:3000',
  basePath:'/',
  apis:['./routes/*.js']
};
const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json',function(req,res){
  res.setHeader('Context-Type','application/json');
  res.send(swaggerSpec);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//cors domain setting
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", '3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

//start server
//app.use(websocketServer);

app.use('/', index);
//app.use('/users', users);
app.use('/api',api);
console.log("---App.js---");
//app.use('/api/oauth/token',oauth2.token);
app.use('/api/oauth',oauth);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
