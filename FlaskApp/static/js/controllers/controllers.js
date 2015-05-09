	'use strict';

	angular.module('caribTrack.controllers',[])

	.controller('GeneralDataController',function($scope, GeneralData){

		$scope.performance = [];
		init();			
		
		function init(){
			selectMenuItem('home');
			$scope.performance = GeneralData.getSentimentPerformance('ttps');
		}

		function selectMenuItem (menuItem) {
	        $('.side-nav li').removeClass('active');
	        if (menuItem) {
	            $('.' + menuItem).addClass('active');
	        }        
		}		

	})

	.controller('TweetsController',function($scope){


		console.log('tweets');

	});

