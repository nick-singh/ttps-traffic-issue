	'use strict';

	angular.module('caribTrack.controllers',[])

	.controller('HomeCtrl',function ($scope, Factories, getTopHashtagAssociation, getTopHashtagsByTime, getTopSentimentByTime){
		// var start = 1425668800,
		// end = 1427673600;
		var end = Math.round((new Date()).getTime() / 1000),
		start = end - (7 * 86400);

		Factories.selectMenuItem('home');			

		$scope.topAsso = [];		
		var topAssoPromise = getTopHashtagAssociation.get(start,end,10);

		topAssoPromise.then(function(data){
			$scope.topAsso = data;				
			$("#viewport").springy({
			    graph: Graphs.graph($scope.topAsso),
			    nodeSelected: function(node){
			      console.log('Node selected: ' + JSON.stringify(node.data));
			    }
			});
		});	


		$scope.topHash = [];
		var topHashPromise = getTopHashtagsByTime.get(start,end, 10);

		topHashPromise.then(function(data){
			$scope.topHash = data;							
			Charts.genColChart('#freqDist','Trending Hashtags', 'in Trinidad and Tobago',$scope.topHash);
		});	

		$scope.topSentiment = [];
		var topSentimentPromise = getTopSentimentByTime.get(start,end, 10);

		topSentimentPromise.then(function(data){
			$scope.topSentiment = data;
			// console.log(JSON.stringify(data));			
			Charts.genBarChart('#topSentiment','Trending Hashtag Sentiment',
								 'in Trinidad and Tobago',$scope.topSentiment.hashtags,{},
								 $scope.topSentiment.positive, $scope.topSentiment.negative);
		});
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

	})


	.controller('AboutCtrl',function($scope, Factories){

		init();			
		
		function init(){
			Factories.selectMenuItem('about');			
		}

		console.log('AboutCtrl');

	});

