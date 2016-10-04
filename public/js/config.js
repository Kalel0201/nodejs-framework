'use strict';

angular.module('dexter').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        var checkLoggedIn = function ($q, $timeout, $http, $location) {
            var deferred = $q.defer();

            $http.get('/loggedin').success(function (user) {
                if (user !== '0') {
                    $timeout(deferred.resolve, 0);
                } else {
                    $timeout(function () {
                        deferred.reject();
                    }, 0);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };

        var checkLoggedOut = function ($q, $timeout, $http, $location) {
            var deferred = $q.defer();

            $http.get('/loggedin').success(function (user) {
                if (user !== '0') {
                    $timeout(function () {
                        deferred.reject();
                    }, 0);
                    $location.url('/login');
                } else {
                    $timeout(deferred.resolve, 0);
                }
            });

            return deferred.promise;
        };


        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('all articles', {
                url: '/articles',
                templateUrl: 'views/articles/list.html',
                resolve: {
                    loggedin: checkLoggedIn
                }
            })
            .state('create article', {
                url: '/articles/create',
                templateUrl: '/views/articles/create.html',
                resolve: {
                    loggedin: checkLoggedIn
                }
            })
            .state('edit article', {
                url: '/articles/:articleId/edit',
                templateUrl: 'views/articles/edit.html',
                resolve: {
                    loggedin: checkLoggedIn
                }
            })
            .state('view an article', {
                url: '/articles/:articleId',
                templateUrl: 'views/articles/view.html',
                resolve: {
                    loggedin: checkLoggedIn
                }
            })
            .state('home', {
                url: '/',
                templateUrl: 'views/index.html'
            })
            .state('auth', {
                templateUrl: 'views/auth/index.html'
            })
            .state('auth.login', {
                url: '/login',
                templateUrl: 'views/auth/login.html',
                resolve: {
                    loggedin: checkLoggedOut
                }
            })
            .state('auth.register', {
                url: '/register',
                templateUrl: '/views/auth/register.html',
                resolve: {
                    loggedin: checkLoggedOut
                }
            });
}]);

angular.module('dexter').config(['$httpProvider', function ($httpProvider) {

}]);

angular.module('dexter').config(['$locationProvider', function ($locationProvider) {
    //$locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
}]);