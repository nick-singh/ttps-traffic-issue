	'use strict';

	angular.module('caribTrack.factories',[])


	.service('getNumberWeeks', function($http){
		var deffered = {};		

		deffered.get = function(){
			return $http.get('get/number/weeks')
			.error(function(res){
				console.log(res);
			});
		};

		return deffered;

	})

	.service('getTopHashtagAssociation', function($http){
		var deffered = {};		

		deffered.get = function(start, end, hashtag){			
			return $http.get('/get/top/hashtags/association/by/time/'+start+'/'+end+'/'+hashtag)
			.error(function(res){
				console.log(res);
			});
		};
		return deffered;

	})


	.service('getTopHashtagsByTime', function($http){
		var deffered = {};	

		deffered.get = function(start, end, limit){			
			return $http.get('/get/top/hashtags/by/time/'+start+'/'+end+'/'+limit)
			.error(function(res){
				console.log(res);
			});		
		};
		return deffered;
	})

	.service('test', function($http){

		var testService = {};
	    //Gets the list of nuclear weapons
	    testService.get = function(start, end, limit){			
			return $http.get('/get/top/hashtags/by/time/'+start+'/'+end+'/'+limit)

			.error(function(res){
				console.log(res);
			});
	    };

	    return testService;
	})


	.service('getTopSentimentByTime', function($http, $q){
		var deffered = {};		

		deffered.get = function(start, end, limit){			
			return $http.get('/get/top/sentiment/by/time/'+start+'/'+end+'/'+limit)

			.error(function(res){
				console.log(res);
			});			
		};
		return deffered;
	})

	.factory('Factories',function($http){

		var factory = {};

		factory.selectMenuItem = function(menuItem) {
	        $('.side-nav li').removeClass('active');
	        if (menuItem) {
	            $('.' + menuItem).addClass('active');
	        }        
		};


		factory.getHashtagTweetsCountByTime = function(start, end, hashtag){

			$http.get('/get/hashtags/tweets/count/by/time/'+start+'/'+end+'/'+hashtag).
			success(function(res){
				console.log(res);
				return res;
			}).
			error(function(res){
				console.log(res);
				return {};
			});

		};


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


		factory.getSentimentByTime = function(start, end, hash){

			$http.get('/get/sentiment/by/time/'+start+'/'+end+'/'+hashtag).
			success(function(res){
				console.log(res);
				return res;
			}).
			error(function(res){
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


		factory.getTweetTextByTime = function(start, end, hashtag){
			$http.get('/get/tweet/text/by/time/'+start+'/'+end+'/'+hashtag).
			success(function(res) {
				console.log(res);
				return res;
			}).
			error(function(res) {
				console.log(res);
				return {};
			});
		};


		factory.getHashtagAssociation = function(start, end, hashtag){
			$http.get('/get/hashtag/association/by/time/'+start+'/'+end+'/'+hashtag).
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