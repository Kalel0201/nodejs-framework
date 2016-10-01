'use strict';

var users = require('../controllers/users');

module.exports = function (app, passport) {
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.post('/users', users.create);
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);

    app.get('/signout', users.signout);
    app.get('/users/me', users.me);

    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: [ 'email', 'user_about_me' ],
        failureRedirect: '/signin'
    }), users.signin);
};
