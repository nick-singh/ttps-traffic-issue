	'use strict';

	angular.module('caribTrack.factories',[])


	.service('getNumberWeeks', function($http, $q){
		var deffered = $q.defer();		

		this.get = function(){
			$http.get('get/number/weeks')

			.then(function(data){
				deffered.resolve(data.data.hashtags);				
			});

			return deffered.promise;
		};

	})

	.service('getTopHashtagAssociation', function($http, $q){
		var deffered = $q.defer();		

		this.get = function(start, end, hashtag){
			$http.get('/get/top/hashtags/association/by/time/'+start+'/'+end+'/'+hashtag)

			.then(function(data){
				deffered.resolve(data.data.hashtags);				
			});

			return deffered.promise;
		};

	})


	.service('getTopHashtagsByTime', function($http, $q){
		var deffered = $q.defer();		

		this.get = function(start, end, limit){
			$http.get('/get/top/hashtags/by/time/'+start+'/'+end+'/'+limit)

			.error(function(res){
				console.log(res);
			})

			.then(function(data){
				deffered.resolve(data.data.hashtags);				
			});

			return deffered.promise;
		};
	})


	.service('getTopSentimentByTime', function($http, $q){
		var deffered = $q.defer();		

		this.get = function(start, end, limit){
			$http.get('/get/top/sentiment/by/time/'+start+'/'+end+'/'+limit)

			.error(function(res){
				console.log(res);
			})

			.then(function(data){
				deffered.resolve(data.data.hashtags);				
			});

			return deffered.promise;
		};
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