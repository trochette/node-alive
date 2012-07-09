'use strict';


// Declare app level module which depends on filters, and services
angular.module('simpleLogin', ['simpleLogin.filters', 'simpleLogin.services', 'simpleLogin.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: LoginController});
    $routeProvider.when('/register', {templateUrl: 'partials/register.html', controller: RegisterController});
    $routeProvider.when('/profile', {templateUrl: 'partials/profile.html', controller: ProfileController});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);


