(function (document, window, $, Backbone, _){



	TRACKER.Views.Home = Backbone.View.extend({

		className : "col-lg-12",

		initialize : function(){
			this.render();
		},

		render : function(){
			$(this.el).html(this.template());	
			var topTags = this.$el.find("#top-tags"),
			topTweets = this.$el.find("#top-tweets"),
			tagsTweets = this.$el.find("#tags-tweets");

			this.genTopHashTags(topTags);
			this.genTopTweets(topTweets);
			this.genTagsTweets(tagsTweets);

			return this;
		},


		selectMenuItem: function (menuItem) {
	        $('.side-nav li').removeClass('active');
	        if (menuItem) {
	            $('.' + menuItem).addClass('active');
	        }
        },

		genTopHashTags : function(id){			
			var topHashTags = new TRACKER.Collections.TopHashtagsCollection();
			topHashTags.fetch({
				success : function(model, response){
					console.log(response.hash);
					TRACKER.Chart.genChart(id,
					 "Top Ten News Tweets", "In Trinidad and Tobago", 
					 response.hash[0], "Tweets", 
					 response.hash[1], "Popularity");

					$.jStorage.set('hash',response.hash[0]);
				},

				error : function(model, response){
					console.log(response);
				}
			});
		},

		genTopTweets : function(id){			
			var toptags = new TRACKER.Collections.TopTagsCollection();
			toptags.fetch({
				success : function(model, response){
					console.log(response.top_tweets);
					TRACKER.Chart.genChart(id,
					 "Top Ten News Tweets", "In Trinidad and Tobago By Number of Tweets", 
					 response.top_tweets[0], "Tweets", 
					 response.top_tweets[1], "Number of Tweets");
				},

				error : function(model, response){
					console.log(response);
				}
			});
		},

		genTagsTweets : function(id){			
			var tagTweets = new TRACKER.Collections.TagTweetsCollection();
			tagTweets.fetch({
				success : function(model, response){
					console.log(response);
				},

				error : function(model, response){
					console.log(response);
				}
			});
		}

	});
	
}(document, this, jQuery, Backbone, _));			