'use strict';

module.exports = function (app, config) {
    var format, options;

    if (config !== false) {
        config = config || {};
        format = config.format || {};
        options = config.options || {};

        app.use(require('morgan')(format, options));
    }
};