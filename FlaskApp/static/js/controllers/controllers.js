	'use strict';

	angular.module('caribTrack.controllers',[])

	.controller('HomeCtrl',function ($scope, Factories, getTopHashtagAssociation){

		$scope.topAsso = [];
		var topAssoPromise = getTopHashtagAssociation.get(1414668800,1427673600,6);

		topAssoPromise.then(function(data){
			$scope.topAsso = data;				
			$("#viewport").springy({
			    graph: Graphs.graph($scope.topAsso),
			    nodeSelected: function(node){
			      console.log('Node selected: ' + JSON.stringify(node.data));
			    }
			});
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

