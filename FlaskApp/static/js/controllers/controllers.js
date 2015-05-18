	'use strict';

	angular.module('caribTrack.controllers',[])

	.controller('HomeCtrl',function ($scope, Factories, getNumberWeeks, 
									getTopHashtagAssociation, getTopHashtagsByTime, 
									getTopSentimentByTime){

		Factories.selectMenuItem('home');
		
		$scope.finished = [0,0,0];

		$scope.$on('LOAD',function(){$scope.loading=true});
		
		$scope.$on('UNLOAD',function(){
			var temp = true;
			$.each($scope.finished, function(i, d){
				if(d === 0) temp = false;
			});
			console.log($scope.finished);
			if(temp) $scope.loading = false;
		});			
		

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
			// $scope.$emit('LOAD');

			var topAssoPromise = getTopHashtagAssociation.get(start,end,10);

			topAssoPromise.then(function(res){	
				$scope.finished[0] = 1;
				var data = res.data.hashtags,
				width = 750;
				// width = parseInt($("#viewportholder").css('width')) - 50;				
				$("#viewportholder").html("");
				$("#viewportholder").append($('<canvas id="viewport" width="'+
				width+'" height="800"></canvas>'));
				arborGraph.draw($("#viewport"),data);

				window.onresize = function(e){
					width = 750;
					// width = parseInt($("#viewportholder").css('width')) - 50;				
					$("#viewportholder").html("");
					$("#viewportholder").append($('<canvas id="viewport" width="'+
					width+'" height="800"></canvas>'));
					arborGraph.draw($("#viewport"),data);
				};
			});	

			
			var topHashPromise = getTopHashtagsByTime.get(start,end, 10);

			topHashPromise.then(function(res){
				$scope.finished[1] = 1;	
				var data = res.data.hashtags;					
				$('#freqDist').empty();
				Charts.genColChart('#freqDist','Trending Hashtags', 'in Trinidad and Tobago',data);
			});	

			
			var topSentimentPromise = getTopSentimentByTime.get(start,end, 10);

			topSentimentPromise.then(function(res){
				$scope.finished[2] = 1;
				var data = res.data.hashtags;				
				$('#topSentiment').empty();
				Charts.genBarChart('#topSentiment','Trending Hashtag Sentiment',
									 'in Trinidad and Tobago',data.hashtags,{},
									 data.positive, data.negative);
				// $scope.$emit('UNLOAD');
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


	.controller('HashtagCtrl',function($scope, $routeParams, $sce, getHashtagAssociation,
										Factories, trackHashtagFreq, getHashtagDates,
										trackHashtagSentiment, getTweetTextByTime){

		$scope.param = $routeParams.tag;
		$scope.hashDates = [];

		var hashDates = getHashtagDates.get($scope.param);
		hashDates.then(function(data){				
			$scope.weeks = data.data.dates;			
			$scope.week = $scope.weeks[0].unix;
			var end = parseInt($scope.week),
			start = end - (7 * 86400);	
			init(start, end);		
		});		

		var point = {
			"point": {
                  events: {
                      click: function() { 
                      	var that = this;
                      	$.each($scope.weeks, function(i, d){
                      		if(d.datetime === that.category){
                      			$($("#dates option")[i]).attr('selected', true);  
                      			return;                    			
                      		}
                      	}); 

                      	var end = Math.round(+new Date(that.category)/1000),
						start = end - (7 * 86400);	
						init(start, end);                   
                      }
                  }
              }
        }; 		

		$scope.change = function(){			
			var end = parseInt($scope.week),
			start = end - (7 * 86400);	
			init(start, end);
		};
			
		
		function init(start, end){
			Factories.selectMenuItem('tweetsdetails');
			
			var hashAssoPromise = getHashtagAssociation.get(start, end, $scope.param);			

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

						
			var tweetTextPromise = getTweetTextByTime.get(start, end, $scope.param);
			$scope.currentPage = 1;
  			$scope.pageSize = 5;
  			$scope.to_trusted = function(html_code) {
			    return $sce.trustAsHtml(html_code);
			}
			tweetTextPromise.then(function(res){	
				var data = res.data.tweets;
				$.each(data, function(index, tweet){
					tweet.text = tweet.text.parseURL().parseHashtag().parseUsername();
					tweet.sentiment = ((tweet.sentiment > 0) ? "list-group-item-info": "list-group-item-danger");                      					
				});
				$scope.tweets = data;								
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


	.controller('RealTimeCtrl',function($scope, Factories){

		init();			
		
		function init(){
			Factories.selectMenuItem('realtime');			
		}

		console.log('RealTimeCtrl');

	})


	.controller('AboutCtrl',function($scope, Factories){

		init();			
		
		function init(){
			Factories.selectMenuItem('about');			
		}

		console.log('AboutCtrl');

	});

