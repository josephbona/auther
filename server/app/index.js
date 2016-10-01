'use strict';

var app = require('express')();
var path = require('path');
var session = require('express-session');
var User = require('../api/users/user.model');
var passport = require('passport');



app.use(session({
  secret: 'test',
  activeDuration: 60000
}));

app.use(function (req, res, next) {
  console.log('session', req.session);
  next();
});

app.use(passport.initialize());
app.use(passport.session());

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
      res.status(204).send(user);
    }
  })
  .catch(next);
});

app.get('/auth/me',function(req,res,next){
  User.findById(req.session.userId)
  .then(function(user){
    if(!user)
      res.sendStats(401);
    else{
      console.log('found user: ',user);
      res.status(204).send(user);
    }
  })
  .catch(next);
});


// Google authentication and login 
app.get('/auth/google', passport.authenticate('google', { scope : 'email' }));

// handle the callback after Google has authenticated the user
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/', // or wherever
    failureRedirect : '/' // or wherever
  })
);

// don't forget to install passport-google-oauth
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(
  new GoogleStrategy({
    clientID: '653713470370-ie5tiifkdmcfahdu04m6t0tht1pe5gq7.apps.googleusercontent.com',
    clientSecret: 'enNPyMKUpp3LCDLnqAt56r5-',
    callbackURL: '/auth/google/callback'
  },
  // Google will send back the token and profile
  function (token, refreshToken, profile, done) {
    // the callback will pass back user profile information and each service (Facebook, Twitter, and Google) will pass it back a different way. Passport standardizes the information that comes back in its profile object.
    
    //--- fill this part in ---
    console.log('---', 'in verification callback', profile, '---');
    var info = {
      name: profile.displayName,
      email: profile.emails[0].value,
      photo: profile.photos ? profile.photos[0].value : undefined
    };
    User.findOrCreate({
      where: {googleId: profile.id},
      defaults: info
    })
    .spread(function (user) {
      done(null, user);
    })
    .catch(done);
    //done();
    
  })
);

app.delete('/logout', function(req, res, next) {

  req.session.usedId = null;
  res.sendStatus(204);
    
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
