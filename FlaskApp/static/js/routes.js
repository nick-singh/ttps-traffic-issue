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
				controller : 'GeneralDataController',
				templateUrl : 'partials/home.html'
			})
			.otherwise({redirectTo : '/'});			
	}]);