(function () {
    'use strict';
    angular.module('dexter.system').factory('Menus', ['$resource', function ($resource) {
        return $resource('admin/menu:name', {
            name: '@name'
        });
    }]);
}());