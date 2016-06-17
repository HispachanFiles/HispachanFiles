var express = require('express');
var socket_io = require( "socket.io" );
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sass = require('node-sass-middleware');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var apiRoutes = require('./routes/api');
var socketRoutes = require('./routes/socket');
var threadRoutes = require('./routes/thread');
var searchRoutes = require('./routes/search');

var settings = require('./settings');
var serverSettings = require('./server-settings');

var app = express();

// Socket.io
var io           = socket_io();
app.io           = io;

// Mongoose
mongoose.connect(serverSettings.db.url);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data')));

app.use('/', routes);
app.use('/', threadRoutes);
app.use('/', searchRoutes);
if(settings.features.apiEnabled)
{
    app.use('/api', apiRoutes);
}

io.on('connection', socketRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if(app.get('env') === 'development')
  {
      res.jsonp(err);
  }
  else
  {
      res.render('error', {
          title: `Error - ${settings.site.title}`,
          settings: settings,
          error: err
      });
  }
});


module.exports = app;
