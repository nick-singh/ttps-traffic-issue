	'use strict';

	angular.module('caribTrack',
	[
		'caribTrack.controllers',
		'caribTrack.factories',
		'ngRoute'

	]).config(['$routeProvider',
		function($routeProvider){

		$routeProvider
			.when('/',
			{
				controller : 'HomeCtrl',
				templateUrl : 'partials/home.html'
			})
			
			.when('/tweetDetails',
			{
				controller : 'TweetDetailsCtrl',
				templateUrl : 'partials/tweetdetails.html'
			})
			
			.when('/realtime',
			{
				controller : 'RealTimeCtrl',
				templateUrl : 'partials/realtime.html'
			})
			
			.when('/search',
			{
				controller : 'SearchCtrl',
				templateUrl : 'partials/search.html'
			})

			.when('/about',
			{
				controller : 'AboutCtrl',
				templateUrl : 'partials/about.html'
			})

			.otherwise({redirectTo : '/'});			
	}]);

	// .run(function($rootScope, ngProgress) {
	//   $rootScope.$on('$routeChangeSatrt', function(ev,data) {
	//     ngProgress.start();
	//   });
	//   $rootScope.$on('$routeChangeSuccess', function(ev,data) {
	//     ngProgress.complete();
	//   });
	// });