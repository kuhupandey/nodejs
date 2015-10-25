'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
  path = require('path');

  swagger = require('swagger-express');


var appConfig = require('./appconfig');

var log = console; // TBD
var h = require('./js/utils/routehelper');

var app = express();

app.set('json spaces', 4);
app.enable('trust proxy');  // Trust HTTP proxy fields from nginx


// TBD
app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// TBD app.all('*', h.notAllowed);

/*app.use(swagger.init(app, {
  apiVersion: '1.0',
  swaggerVersion: '1.0',
  basePath: 'http://localhost:3000',  // TBD port
  swaggerURL: '/swagger',
  swaggerJSON: '/api-docs.json',
  swaggerUI: './public/swagger/',
  apis: ['./js/event-listener-end-point/routes.js']
}));
//app.use(express.static(path.join(__dirname, 'public')));  // TBD
*/

/* TBD var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  app.use(express.errorHandler());
}
*/

var eventlistener = require('./js/event-listener-end-point/routes');
eventlistener.init(app);

var tarnsferService = require('./js/transfer-end-point/routes');
transferService.init(app);

var server = app.listen(appConfig.mmPort, function() {
  log.info('MM running in ' + appConfig.mmMode + ' mode on port ' + appConfig.mmPort);

  if (appConfig.redisHost !== 'localhost') {
    log.info('Using redis on ' + appConfig.redisHost);
  }

  if (appConfig.server !== 'localhost') {
    log.info('Using storage server on ' + appConfig.server);
  }
});

exports.stopServer = function() {
  log.debug('stopping server...');
  server.close();
}
