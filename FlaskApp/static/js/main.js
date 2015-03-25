
(function (document, window, $, Backbone, _){
	

	TRACKER.Routers.AppRouter = Backbone.Router.extend({

		routes: {
			"" 			: "dashboard",
			"tweetList" : "tweetList"
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