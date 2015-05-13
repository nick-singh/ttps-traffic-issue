	'use strict';

	angular.module('caribTrack.controllers',[])

	.controller('HomeCtrl',function ($scope, Factories, getNumberWeeks, 
									getTopHashtagAssociation, getTopHashtagsByTime, 
									getTopSentimentByTime, test){

		Factories.selectMenuItem('home');			

		$scope.weeks = [];
		var numWeeks = getNumberWeeks.get();
		numWeeks.then(function(data){			
			$scope.weeks = data.data.weeks;			
			$scope.week = $scope.weeks[0].unix;
			var start = parseInt($scope.week),
			end = start + (7 * 86400);
			init(start, end);
		});				

		$scope.change = function(){
			// console.log($scope.week);
			var start = parseInt($scope.week),
			end = start + (7 * 86400);
			init(start, end);
		};

		function init(start, end){
			
			var topAssoPromise = getTopHashtagAssociation.get(start,end,10);

			topAssoPromise.then(function(res){	
				var data = res.data.hashtags;
				$("#viewportholder").html("");
				$("#viewportholder").append($('<canvas id="viewport" width="1600" height="400"></canvas>'));
				arborGraph.draw($("#viewport"),data);
			});	

			
			var topHashPromise = getTopHashtagsByTime.get(start,end, 10);

			topHashPromise.then(function(res){	
				var data = res.data.hashtags;					
				$('#freqDist').empty();
				Charts.genColChart('#freqDist','Trending Hashtags', 'in Trinidad and Tobago',data);
			});	

			
			var topSentimentPromise = getTopSentimentByTime.get(start,end, 10);

			topSentimentPromise.then(function(res){
				var data = res.data.hashtags;				
				$('#topSentiment').empty();
				Charts.genBarChart('#topSentiment','Trending Hashtag Sentiment',
									 'in Trinidad and Tobago',data.hashtags,{},
									 data.positive, data.negative);
			});
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

	})


	.controller('AboutCtrl',function($scope, Factories){

		init();			
		
		function init(){
			Factories.selectMenuItem('about');			
		}

		console.log('AboutCtrl');

	});

