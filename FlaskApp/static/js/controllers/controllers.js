	'use strict';

	angular.module('caribTrack.controllers',[])

	.controller('HomeCtrl',function ($scope, $q, Factories, getNumberWeeks, 
									getTopHashtagAssociation, getTopHashtagsByTime, 
									getTopSentimentByTime){

		Factories.selectMenuItem('home');			

		$scope.$on('LOAD',function(){$scope.loading=true});
		
		$scope.$on('UNLOAD',function(){$scope.loading=false});			
		

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
			$scope.$emit('LOAD');
			var topAssoPromise = getTopHashtagAssociation.get(start,end,10);
			var topHashPromise = getTopHashtagsByTime.get(start,end, 10);
			var topSentimentPromise = getTopSentimentByTime.get(start,end, 10);

			$q.all([topAssoPromise, topHashPromise, topSentimentPromise]).then(function(allData){
				$scope.$emit('UNLOAD');
				hashAsso(allData[0].data.hashtags);
				topHash(allData[1].data.hashtags);
				topSentiment(allData[2].data.hashtags);				
			});
		}

		function hashAsso(data){
			var width = 750;							
			$("#viewportholder").html("");
			$("#viewportholder").append($('<canvas id="viewport" width="'+
			width+'" height="800"></canvas>'));
			arborGraph.draw($("#viewport"),data);

			window.onresize = function(e){
				width = 750;							
				$("#viewportholder").html("");
				$("#viewportholder").append($('<canvas id="viewport" width="'+
				width+'" height="800"></canvas>'));
				arborGraph.draw($("#viewport"),data);
			};
		}

		function topHash(data){	
			console.log(data);
			$('#freqDist').empty();
			Charts.genColChart('#freqDist','Trending Hashtags', 'in Trinidad and Tobago',data);
		}	

		function topSentiment(data){
			console.log(data);	
			$('#topSentiment').empty();
			Charts.genBarChart('#topSentiment','Trending Hashtag Sentiment',
								 'in Trinidad and Tobago',data.hashtags,{},
								 data.positive, data.negative);		
		}
				
	})

	.controller('HashDetailsCtrl',function($scope, Factories, getHashList){

		$scope.$on('LOAD',function(){$scope.loading=true});
		
		$scope.$on('UNLOAD',function(){$scope.loading=false});	

		$scope.alpha = "abcdefghijklmnopqrstuvwxyz".split("");
		$scope.firstletterOfHash = "";
		init();					
		function init(){
			$scope.$emit('LOAD');
			Factories.selectMenuItem('tweetsdetails');	
			var hashlist = getHashList.get();
			hashlist.then(function(res){
				$scope.hashList = res.data.hashtags;
				$scope.$emit('UNLOAD');
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

	})


	.controller('HashtagCtrl',function($scope, $routeParams, $sce, $q, getHashtagAssociation,
										Factories, trackHashtagFreq, getHashtagDates,
										trackHashtagSentiment, getTweetTextByTime){

		$scope.param = $routeParams.tag;
		$scope.hashDates = [];

		$scope.$on('LOAD',function(){$scope.loading=true});
		
		$scope.$on('UNLOAD',function(){$scope.loading=false});


		$scope.$on('Tweets',function(){$scope.haveTweets=true});
		
		$scope.$on('NoTweets',function(){$scope.haveTweets=false});	

		Factories.selectMenuItem('tweetsdetails');

		var hashDates = getHashtagDates.get($scope.param);
		hashDates.then(function(data){				
			$scope.weeks = data.data.dates;			
			$scope.week = $scope.weeks[0].unix;
			var end = parseInt($scope.week),
			start = end - (7 * 86400);	
			init(start, end);
			charts();		
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
			
			var hashAssoPromise = getHashtagAssociation.get(start, end, $scope.param);			

			hashAssoPromise.then(function(res){	
				var data = res.data.hashtags,
				width = 750;

				$("#assoGraph").html("");
				$("#assoGraph").append($('<canvas id="viewport" width="'+
				width+'" height="450"></canvas>'));
				arborGraph.draw($("#viewport"),data);

				window.onresize = function(e){
					width = 750;
					$("#assoGraph").html("");
					$("#assoGraph").append($('<canvas id="viewport" width="'+
					width+'" height="450"></canvas>'));
					arborGraph.draw($("#viewport"),data);
				};
			});				

			console.log(start, end)						
			var tweetTextPromise = getTweetTextByTime.get(start, end, $scope.param);
			$scope.currentPage = 1;
  			$scope.pageSize = 5;
  			$scope.to_trusted = function(html_code) {
			    return $sce.trustAsHtml(html_code);
			}
			tweetTextPromise.then(function(res){	
				var data = res.data.tweets;
				console.log(data.length);
				if(data.length > 0){
					$scope.$emit("Tweets");
					$.each(data, function(index, tweet){
						tweet.text = tweet.text.parseURL().parseHashtag().parseUsername();
						tweet.sentiment = ((tweet.sentiment > 0) ? "list-group-item-info": "list-group-item-danger");                      					
					});
					$scope.tweets = data;
				}else{
					$scope.$emit("NoTweets");
				}					
			});					
		}	


		function charts(){
			$scope.$emit('LOAD');
			var hashFreqPromise = trackHashtagFreq.get($scope.param);
			var sentimentPromise = trackHashtagSentiment.get($scope.param);

			$q.all([hashFreqPromise, sentimentPromise]).then(function(allData){
				$scope.$emit('UNLOAD');
				hashFreq(allData[0].data.hashtags);
				hashSentiment(allData[1].data.sentiment);
			});
		}
	
		

		function hashFreq(data){
			$('#freqChart').empty();
			data[0].data[0]['point'] = point.point;			
			Charts.genSplineChart('#freqChart','Frequency of', $scope.param, data[0].date, "Frequency", data[0].data);
		}


		

		function hashSentiment(data){
			$('#sentiChart').empty();

			data[0].data[0]['point'] = point.point;
			data[0].data[1]['point'] = point.point;
			Charts.genSplineChart('#sentiChart','Sentiment of', $scope.param, data[0].date, "Sentiment", data[0].data);
		}

	})


	.controller('CompareCtrl',function($scope, $q, Factories, getHashList,
										trackHashtagFreqInd, trackHashtagSentimentInd){
		
		$scope.$on('LOAD',function(){$scope.loading=true});
		
		$scope.$on('UNLOAD',function(){$scope.loading=false});


		$scope.$on('HasVals',function(){$scope.vals=true});
		
		$scope.$on('NoVals',function(){$scope.vals=false});

		init();			
		
		function init(){			

			Factories.selectMenuItem('compare');	

			$scope.$emit('NoVals');

			$scope.selectFirst = '';			

			var hashlist = getHashList.get();
			hashlist.then(function(res){
				$scope.hashList = res.data.hashtags;								
			});	

			$("#selectFirstGraph").empty();
			$("#selectSecondGraph").empty();
			$("#selectThirdGraph").empty();
			Charts.jsonChart('#selectFirstGraph','Positive Sentiment of', "Hashtags", "Tweets",[]);
			Charts.jsonChart('#selectSecondGraph','Negative Sentiment of', "Hashtags", "Tweets",[]);			
			Charts.jsonChart('#selectThirdGraph','Frequency of', "Hashtags", "Tweets",[]);
			
		}

		function hashFreq(id, data){
			var chart = $(id).highcharts();
	        chart.addSeries({
	            name: data.name,
	            data: data.freq
	        });						
		}


		function hashPosSentiment(id, data){		
			var chart = $(id).highcharts();
	        chart.addSeries({
	            name: data.name,
	            data: data.pos
	        });				
		}

		function hashNegSentiment(id, data){
			console.log(JSON.stringify(data));
			var chart = $(id).highcharts();
	        chart.addSeries({
	            name: data.name,
	            data: data.neg
	        });				
		}


		function PlotCharts(first){
			$scope.$emit('LOAD');

			var trackSentiment = trackHashtagSentimentInd.get(first),						
			trackFreq = trackHashtagFreqInd.get(first);

			$q.all([trackSentiment, trackFreq]).then(function(allData){
				$scope.$emit('UNLOAD');
				// console.log(JSON.stringify(allData));
				$scope.selectFirst = '';
				hashFreq("#selectThirdGraph",allData[1].data.hashtags[0]);
				hashNegSentiment("#selectSecondGraph",allData[0].data.sentiment[0]);				
				hashPosSentiment("#selectFirstGraph",allData[0].data.sentiment[0]);
				$scope.$emit('HasVals');
			});
		}

		$scope.getVals = function(){
			if($scope.selectFirst !== ''){
				PlotCharts($scope.selectFirst);
				$("#hashInput").removeClass('has-error');
			}else{
				alert("Please Select a Hashtag");
				$("#hashInput").addClass('has-error');
			}			
		};

		$scope.reset = function(){

			$scope.$emit('NoVals');
			$scope.selectFirst = '';			
			$("#selectFirstGraph").empty();
			$("#selectSecondGraph").empty();
			$("#selectThirdGraph").empty();
			Charts.jsonChart('#selectFirstGraph','Positive Sentiment of', "Hashtags", "Tweets",[]);
			Charts.jsonChart('#selectSecondGraph','Negative Sentiment of', "Hashtags", "Tweets",[]);			
			Charts.jsonChart('#selectThirdGraph','Frequency of', "Hashtags", "Tweets",[]);
		}


	})


	.controller('AboutCtrl',function($scope, Factories){

		init();			
		
		function init(){
			Factories.selectMenuItem('about');			
		}

		console.log('AboutCtrl');

	});

