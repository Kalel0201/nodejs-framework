// (function () {
    'use strict';

    angular.module('dexter.controllers.login', [])
        .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
            $scope.user = {};

            $scope.login = function () {
                $http.post('/login', {
                    email: $scope.user.email,
                    password: $scope.user.password
                }).success(function (user) {
                    $scope.loginError = 0;
                    $rootScope.user = user;
                    $rootScope.$emit('loggedin');
                    $location.url('/');
                }).error(function () {
                    $scope.loginError = 'Authentication failed.';
                });
            };
        }])
        .controller('RegisterCtrl', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
            $scope.user = {};

            $scope.register = function () {
                $scope.usernameError = null;
                $scope.registerError = null;
                $http.post('/register', {
                    name: $scope.user.name,
                    username: $scope.user.username,
                    email: $scope.user.email,
                    password: $scope.user.password,
                    confirmPassword: $scope.user.confirmPassword
                }).success(function () {
                    $scope.registerError = 0;
                    $rootScope.user = $scope.user.name;
                    $rootScope.$emit('loggedin');
                    $location.url('/');
                }).error(function (error) {
                    if (error === 'Username already taken') {
                        $scope.usernameError = error;
                    } else {
                        $scope.registerError = error;
                    }
                });
            };
        }]);
// });