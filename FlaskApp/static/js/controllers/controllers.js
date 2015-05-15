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
			var end = parseInt($scope.week),
			start = end - (7 * 86400);
			init(start, end);
		});				

		$scope.change = function(){
			// console.log($scope.week);
			var end = parseInt($scope.week),
			start = end - (7 * 86400);
			init(start, end);
		};

		function init(start, end){
			
			var topAssoPromise = getTopHashtagAssociation.get(start,end,10);

			topAssoPromise.then(function(res){	
				var data = res.data.hashtags,
				width = parseInt($("#viewportholder").css('width')) - 50;				
				$("#viewportholder").html("");
				$("#viewportholder").append($('<canvas id="viewport" width="'+
				width+'" height="800"></canvas>'));
				arborGraph.draw($("#viewport"),data);

				window.onresize = function(e){
					width = parseInt($("#viewportholder").css('width')) - 50;				
					$("#viewportholder").html("");
					$("#viewportholder").append($('<canvas id="viewport" width="'+
					width+'" height="800"></canvas>'));
					arborGraph.draw($("#viewport"),data);
				};
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

	.controller('HashDetailsCtrl',function($scope, Factories, getHashList){

		$scope.alpha = "abcdefghijklmnopqrstuvwxyz".split("");
		$scope.firstletterOfHash = "";
		init();					
		function init(){
			Factories.selectMenuItem('tweetsdetails');	
			var hashlist = getHashList.get();
			hashlist.then(function(res){
				$scope.hashList = res.data.hashtags;
			});	
		}

		$scope.refreshHashtags = function(){
			$scope.firstletterOfHash = "";
			$scope.search.word = "";
		};

		$scope.searchByFirstLetter = function(){			
			$scope.firstletterOfHash = this.letter;
			console.log($scope.firstletterOfHash);
		};

		$scope.criteriaMatch = function( firstletterOfHash ) {
			return function( item ) {
				if(firstletterOfHash === "") return true;
				return item[0] === firstletterOfHash;
			};
		};
		console.log('HashDetailsCtrl');

	})

	.controller('RealTimeCtrl',function($scope, Factories){

		init();			
		
		function init(){
			Factories.selectMenuItem('realtime');			
		}

		console.log('RealTimeCtrl');

	})


	.controller('HashtagCtrl',function($scope, $routeParams, getHashtagAssociation,
										Factories, trackHashtagFreq, getNumberWeeks,
										trackHashtagSentiment, getTweetTextByTime){

		$scope.param = $routeParams.tag;
		$scope.numWeeks = [];

		var numWeeks = getNumberWeeks.get();
		numWeeks.then(function(data){	
			
			$scope.weeks = data.data.weeks;			
			$scope.week = $scope.weeks[0].unix;
			var end = parseInt($scope.week),
			start = end - (7 * 86400);	
			init(start, end);		
		});		

		var point = {
			"point": {
                  events: {
                      click: function() {                          
                        console.log(this);
                      }
                  }
              }
        }; 		
// 
		$scope.change = function(){			
			var end = parseInt($scope.week),
			start = end - (7 * 86400);	
			init(start, end);
		};
			
		
		function init(start, end){
			Factories.selectMenuItem('tweetsdetails');
			// 1414668800,1427673600
			var hashAssoPromise = getHashtagAssociation.get(start, end, $scope.param);
			// var hashAssoPromise = getHashtagAssociation.get(1414668800,1427673600, $scope.param);

			hashAssoPromise.then(function(res){	
				var data = res.data.hashtags,
				width = parseInt($("#assoGraph").css('width')) - 50;

				$("#assoGraph").html("");
				$("#assoGraph").append($('<canvas id="viewport" width="'+
				width+'" height="400"></canvas>'));
				arborGraph.draw($("#viewport"),data);

				window.onresize = function(e){
					width = parseInt($("#assoGraph").css('width')) - 50;				
					$("#assoGraph").html("");
					$("#assoGraph").append($('<canvas id="viewport" width="'+
					width+'" height="400"></canvas>'));
					arborGraph.draw($("#viewport"),data);
				};
			});				

			// 1414668800,1427673600
			// var tweetTextPromise = getTweetTextByTime.get(1414668800,1427673600, $scope.param);
			var tweetTextPromise = getTweetTextByTime.get(start, end, $scope.param);

			tweetTextPromise.then(function(res){	
				var data = res.data.tweets;					
				console.log(data);
			});					
		}	

	
		var hashFreqPromise = trackHashtagFreq.get($scope.param);

		hashFreqPromise.then(function(res){	
			var data = res.data.hashtags;					
			$('#freqChart').empty();
			data[0].data[0]['point'] = point.point;			
			Charts.genSplineChart('#freqChart','Frequency of', $scope.param, data[0].date, "Frequency", data[0].data);
		});	


		var sentimentPromise = trackHashtagSentiment.get($scope.param);

		sentimentPromise.then(function(res){	
			var data = res.data.sentiment;					
			$('#sentiChart').empty();
			data[0].data[0]['point'] = point.point;
			data[0].data[1]['point'] = point.point;
			Charts.genSplineChart('#sentiChart','Sentiment of', $scope.param, data[0].date, "Sentiment", data[0].data);
		});	

	})


	.controller('AboutCtrl',function($scope, Factories){

		init();			
		
		function init(){
			Factories.selectMenuItem('about');			
		}

		console.log('AboutCtrl');

	});

