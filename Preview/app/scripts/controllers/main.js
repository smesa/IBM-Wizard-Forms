'use strict';

/**
 * @ngdoc function
 * @name exampleWssapApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the exampleWssapApp
 */
angular.module('exampleWssapApp')
  .controller('MainCtrl', function ($scope,$http) {


  	var urlAPI = 'http://hgmsapdev01.hgm.com:8000/sap/bc/restsivigila?';
  	var urlAction = 'action=list';

  	$scope.list = [];

  	$http.get(urlAPI + urlAction).
  		success(function(list){
  			$scope.list = list;
  		});


  });
