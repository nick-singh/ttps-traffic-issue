

(function (document, window, $, Backbone, _){

	window.TRACKER = {
		Routers			: {},
		Views 			: {},
		Models			: {},
		Collections		: {},
		templateLoader 	: {}
	};



	TRACKER.Models.TopHashtagsModel = Backbone.Model.extend({				
		urlRoot : '/get/popular/hashtags',

		initialize: function(){	
			console.log("loading" + this.urlRoot);		
		}
	});	

	TRACKER.Collections.TopHashtagsCollection = Backbone.Collection.extend({
		model 	: TRACKER.Models.TopHashtagsModel,
		url 	: '/get/popular/hashtags'
	});



	TRACKER.Models.TopTagsModel = Backbone.Model.extend({						

		urlRoot : '/get/top/relevant/tweets',

		initialize: function(){	
			console.log("loading" + this.urlRoot);		
		}
	});	

	TRACKER.Collections.TopTagsCollection = Backbone.Collection.extend({
		model 	: TRACKER.Models.TopTagsModel,
		url 	: '/get/top/relevant/tweets'
	});




	TRACKER.Models.TagTweetsModel = Backbone.Model.extend({						

		urlRoot : '/get/top/hashtag/tweets',

		initialize: function(){	
			console.log('usage model');		
		},

		defaults: {
			"name": "Trinidad", 
      		"tweets": []
	    }
	});	

	TRACKER.Collections.TagTweetsCollection = Backbone.Collection.extend({
		model 	: TRACKER.Models.TagTweetsModel,
		url 	: '/get/top/hashtag/tweets'	
	});

}(document, this, jQuery, Backbone, _));