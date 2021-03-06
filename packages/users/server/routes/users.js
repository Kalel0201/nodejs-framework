'use strict';

var users = require('../controllers/users'),
    config = require('nodejscore').loadConfig();

module.exports = function (Users, app, auth, database, passport) {
    app.route('/register')
        .post(users.create);
    app.route('/login')
        .post(passport.authenticate('local', {
            failureFlash: true
        }), function (req, res) {
            res.send({
                user: req.user,
                redirect: req.user.roles.indexOf('admin') !== -1 ? req.get('referer') : false
            });
        });
    app.route('/logout')
        .get(users.signout);
    app.route('/users/me')
        .get(users.me);

    app.route('/auth/facebook')
        .get(passport.authenticate('facebook', {
            scope: [ 'email', 'user_about_me' ],
            failureRedirect: '/signin'
        }), users.signin);

    app.route('/loggedin')
        .get(function (req, res) {
            res.send(req.isAuthenticated() ? req.user : '0');
        });

    app.route('/get-config')
        .get(function (req, res) {
            var clientIdProperty = 'clientID',
                defaultPrefix = 'DEFAULT_',
                socialNetworks = ['facebook', 'linkedin', 'twitter', 'github', 'google'],
                configureApps = {};

            for (var network in socialNetworks) {
                var netObject = config[socialNetworks[network]];

                if (netObject && netObject.hasOwnProperty(clientIdProperty) &&
                    netObject[clientIdProperty].indexOf(defaultPrefix) < 0) {
                    configureApps[socialNetworks[network]] = true;
                }
            }

            res.send(configureApps);
        });
};
