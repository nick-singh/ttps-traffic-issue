	'use strict';

	angular.module('caribTrack.factories',[])

	.factory('GeneralData',function($http){

		var factory = {};

		factory.getFreqPerformance = function(hash){			
			$http.get('/get/hashtag/freq/preformance/'+hash).
			success(function(res) {
				console.log(JSON.stringify(res));
				return res;
			}).
			error(function(res) {
				console.log(res);
				return {};
			});
		};

		factory.getSentimentPerformance = function(hash){			
			$http.get('/get/hashtag/sentiment/preformance/'+hash).
			success(function(res) {
				console.log(res);
				return res;
			}).
			error(function(res) {
				console.log(res);
				return {};
			});
		};


		return factory;
	});