'use strict';

var app = require('express')();
var path = require('path');
var session = require('express-session');
var User = require('../api/users/user.model');

app.use(session({
  secret: 'test'
}));

app.use(function (req, res, next) {
  console.log('session', req.session);
  next();
});

app.use(require('./logging.middleware'));

app.use(require('./request-state.middleware'));

app.post('/login', function(req, res, next) {
  console.log('post request to login');
  User.findOne({
    where: req.body
  })
  .then(function(user) {
    if(!user) {
      res.sendStatus(401);
    } else {
      console.log('got a user');
      req.session.usedId = user.id;
      res.sendStatus(204);
    }
  })
  .catch(next);
});

app.use('/api', require('../api/api.router'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.use(require('./statics.middleware'));

app.use(require('./error.middleware'));

module.exports = app;
