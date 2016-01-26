// 'use strict'

var mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.authCallback = function (req, res, next) {
    res.redirect('/');
};

exports.signin = function (req, res) {
    res.render('users/signin', {
        title: 'Sign in',
        message: req.flash('error')
    })
};

exports.signup = function (req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
};

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/');
};

exports.session = function (req, res) {
    res.redirect('/');
};

exports.create = function (req, res) {
    var user = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        provider: 'local'
    });
    //var user = new User(req.body);

    user.save(function (err) {
        if (err) {
            return res.render('users/signup', { error: err.errors, user: user });
        }

        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })
};