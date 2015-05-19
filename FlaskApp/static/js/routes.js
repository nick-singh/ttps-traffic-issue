	'use strict';

	angular.module('caribTrack',
	[
		'caribTrack.controllers',
		'caribTrack.factories',
		'angularUtils.directives.dirPagination',
		'ngRoute'

	])

	.filter('startsWithLetter', function () {
	  return function (items, letter) {
	    var filtered = [];
        var letterMatch = new RegExp(letter, 'i');
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (letterMatch.test(item.name.substring(0, 1))) {
                filtered.push(item);
            }
        }
        return filtered;
	  };
	})

	.config(['$routeProvider',
		function($routeProvider){

		$routeProvider
			.when('/',
			{
				controller : 'HomeCtrl',
				templateUrl : 'partials/home.html'
			})
			
			.when('/hashDetails',
			{
				controller : 'HashDetailsCtrl',
				templateUrl : 'partials/hashdetails.html'
			})
			
			.when('/realtime',
			{
				controller : 'RealTimeCtrl',
				templateUrl : 'partials/realtime.html'
			})
			
			.when('/hashtag/:tag',
			{
				controller : 'HashtagCtrl',
				templateUrl : 'partials/hashtag.html'
			})

			.when('/about',
			{
				controller : 'AboutCtrl',
				templateUrl : 'partials/about.html'
			})

			.otherwise({redirectTo : '/'});			
	}]);