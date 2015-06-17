'use strict';

/**
 * @ngdoc overview
 * @name exampleWssapApp
 * @description
 * # exampleWssapApp
 *
 * Main module of the application.
 */
angular
  .module('exampleWssapApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/llenar/:formid', {
        templateUrl: 'views/llenar.html',
        controller: 'LlenarCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
