var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// No need to route outside API since using SPA.
//var routes = require('./app_server/routes/index');
var apiRoutes = require('./api/routes/index');

var app = express();

// view engine setup
// This view setup isn't really needed (and app_server isn't needed)
// since everything is being done on client side with angular SPA. However,
// when shit hits the fan, here's an error view for express to use and send a 404
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));

// API
app.use('/api', apiRoutes);

app.use(express.static(path.join(__dirname, 'public')));

// Serve our app to the browser. The Express static function will automatically
// default to any file called 'index'. So our angular index template is defaulted
// to without routing.
app.use(express.static(path.join(__dirname, 'app_client')));

// Don't do routing through Express since using SPA.
//app.use('/', routes);

// If we send a route in the URL bar, or refresh, the route is sent to express, not handled
// by Angular. So be sure to redirect everything back to Angular to handle.
app.use(function(req, res){
  res.sendfile(path.join(__dirname, 'app_client', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found on Server');
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
