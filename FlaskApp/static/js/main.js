
(function (document, window, $, Backbone, _){
	

	TRACKER.Routers.AppRouter = Backbone.Router.extend({

		routes: {
			"" 	: "dashboard"
		},

		initialize : function(){
			console.log("initialize");				
		},

		dashboard : function(){				
			this.home = new TRACKER.Views.Home();				
			$("#content").html(this.home.el);
		}

	});

	TRACKER.templateLoader.load(["Home"],function () {      
		$(document).ready(function(){
			app = new TRACKER.Routers.AppRouter();
			Backbone.history.start();
		});
	});


}(document, this, jQuery, Backbone, _));