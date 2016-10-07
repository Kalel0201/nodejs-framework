//'use strict';

var express = require('express'),
    helpers = require('view-helpers'),
    consolidate = require('consolidate'),
    mongoStore = require('connect-mongo')(express),
    flash = require('connect-flash'),
    expressValidator = require('express-validator'),
    assetmanager = require('assetmanager'),
    config = require('./config');

module.exports = function (dexter, app, passport, db) {
    app.set('showStackError', true);

    // pretty HTML
    app.locals.pretty = true;
    // cache=memory or swig die in NODE_ENV=production
    app.locals.cache = 'memory';

    app.use(express.compress({
        filter: function (req, res) {
            return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    if (process.env.ENV !== 'test') {
        app.use(express.logger('dev'));
    }

    // Assign the template engine to .html files
    app.engine('html', consolidate[config.templateEngine]);

    // Set view path, template, engine, default layout
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'html');

    app.enable('jsonp callback');

    app.configure(function () {
        app.use(express.cookieParser());
        //app.use(express.bodyParser());
        app.use(express.urlencoded());
        app.use(express.json());
        app.use(expressValidator());
        app.use(express.methodOverride());

        var assets = assetmanager.process({
            assets: require('./assets.json'),
            webroot: 'public',
            debug: process.env.NODE_ENV !== 'production'
        });
        // Add assets to local veriables
        app.use(function (req, res, next) {
            res.locals({
                assets: assets
            });
            next();
        });

        app.use(express.session({
            secret: config.sessionSecret,
            store: new mongoStore({
                //db: db.connection.db,
                url: config.db,
                collection : config.sessionController
            })
        }));


        // dynamic helpers
        app.use(helpers(config.app.name));

        // express session
        app.use(passport.initialize());
        app.use(passport.session());

        app.use(dexter.get('middleware').before);

        // connect flash for flash message
        app.use(flash());

        // routes should be at the last
        app.use(app.router);

        app.use(express.favicon());
        app.use(express.static(config.root + '/public'));
        dexter.events.on('enableDexterModules', function () {
            dexter.modules.forEach(function (module) {
                app.use('/' + module.name, express.static(config.root + '/node_modules/' + module.name + '/public'));
            });
            app.use(dexter.get('middleware').after);
            app.use(function (err, req, res, next) {
                if (~err.message.indexOf('not found')) {
                    return next();
                }

                // log it
                console.error(err.stack);

                // error page
                res.status(500)
                    .render('500', {
                        error: err.stack
                    });
            });

            // assume 404 since no middleware responded
            app.use(function(req, res){
                res.status(404)
                    .render('404', {
                        url: req.originalUrl,
                        error: 'Not found'
                    });
            });

        });
    });
};