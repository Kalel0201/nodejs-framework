// (function () {
    // 'use strict';

    module.exports.render = function (req, res) {
        res.render('index', {
            user: req.user ? JSON.stringify(req.user.name) : 'null'
        });
    };
// });