'use strict';

/**
 * @ngdoc function
 * @name exampleWssapApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the exampleWssapApp
 */
angular.module('exampleWssapApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
