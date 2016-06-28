var mongoose = require('mongoose');
require('./projects'); // This file is included in app, so include our models here to be included in the app.
require('./users');

var dbURI = 'mongodb://localhost/jorgePortfolio';
mongoose.connect(dbURI);

mongoose.connection.on('connected', function(){
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err){
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function(){
  console.log('Mongoose disconnected');
});

var gracefulShutdown = function(msg, callback){
  mongoose.connection.close(function(){
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};

// Close mongo when hosting apps terminate.
process.once('SIGUSR2', function(){
  gracefulShutdown('nodemon restart', function(){
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.on('SIGINT', function(){
  gracefulShutdown('app termination', function(){
    process.exit(0);
  });
});

process.on('SIGTERM', function(){
  gracefulShutdown('Heroku app shutdown', function(){
    process.exit(0);
  });
});
