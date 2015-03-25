
(function (document, window, $, Backbone, _){
	

	TRACKER.Routers.AppRouter = Backbone.Router.extend({

		routes: {
			"" 					: "dashboard",
			"tweetList" 		: "tweetList",
			"tweetList/:hash" 	: "tweetList"
		},

		initialize : function(){
			console.log("initialize");
			// this.home = new TRACKER.Views.Home();				
		},

		dashboard : function(){				
			this.home = new TRACKER.Views.Home();				
			$("#content").html(this.home.el);
			selectMenuItem('home');
		},

		tweetList : function(){
			this.tweets = new TRACKER.Views.Tweets();				
			$("#content").html(this.tweets.el);
			selectMenuItem('tweets');	
		},

		tweetListHash : function(hash){
			// this.tweets = new TRACKER.Views.Tweets();

			$("#content").html(this.tweets.el);
			$("#hash [value = '"+hash+"']").attr('selected',true).change();
			selectMenuItem('tweets');	
		}

	});

	function selectMenuItem (menuItem) {
        $('.side-nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }        
	}

	TRACKER.templateLoader.load(["Home", "Tweets", "Tweetlist"],function () {      
		$(document).ready(function(){
			app = new TRACKER.Routers.AppRouter();
			Backbone.history.start();
		});
	});


}(document, this, jQuery, Backbone, _));