'use strict';

/**
 * @ngdoc filter
 * @name exampleWssapApp.filter:capitalize
 * @function
 * @description
 * # capitalize
 * Filter in the exampleWssapApp.
 */
angular.module('exampleWssapApp')
  .filter('capitalize', function () {
	  return function(input, scope) {
	    if (input!=null)
	    input = input.toLowerCase();
	    return input.substring(0,1).toUpperCase()+input.substring(1);
	  }

  });
