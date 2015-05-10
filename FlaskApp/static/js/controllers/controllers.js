	'use strict';

	angular.module('caribTrack.controllers',[])

	.controller('HomeCtrl',function($scope, Factories){

		$scope.performance = [];
		init();			
		
		function init(){
			Factories.selectMenuItem('home');
			$scope.performance = Factories.getSentimentPerformance('ttps');
		}			

	})

	.controller('TweetDetailsCtrl',function($scope, Factories){

		init();			
		
		function init(){
			Factories.selectMenuItem('tweetsdetails');			
		}
		console.log('TweetDetailsCtrl');

	})

	.controller('RealTimeCtrl',function($scope, Factories){

		init();			
		
		function init(){
			Factories.selectMenuItem('realtime');			
		}

		console.log('RealTimeCtrl');

	})


	.controller('SearchCtrl',function($scope, Factories){

		init();			
		
		function init(){
			Factories.selectMenuItem('search');			
		}

		console.log('SearchCtrl');

	});

