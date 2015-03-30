(function (document, window, $, Backbone, _){



	TRACKER.Views.Home = Backbone.View.extend({

		className : "col-lg-12",

		initialize : function(){
			this.render();
		},

		render : function(){
			$(this.el).html(this.template());	
			var topTags = this.$el.find("#top-tags"),
			topTweets = this.$el.find("#top-tweets");			

			this.genTopHashTags(topTags);
			this.genTopTweets(topTweets);			

			return this;
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
		}

	});

	TRACKER.Views.Tweets = Backbone.View.extend({

		className : "col-lg-12",

		initialize : function(){
			this.render();
		},

		render : function(){
			$(this.el).html(this.template());	
			var hashList = this.$el.find("#hash");

			$.each($.jStorage.get('hash'),function(i,d){
				hashList.append(new TRACKER.Views.ListOptions({model:d}).el);
			});
			this.genTagsTweets();			

			return this;
		},		

		genTagsTweets : function(){			
			var tagTweets = new TRACKER.Collections.TagTweetsCollection(),
			that = this;
			tagTweets.fetch({
				success : function(model, response){
					$.jStorage.set('tweetText',response.tag_tweets);	
					that.findTweetsByName();				
				},

				error : function(model, response){
					console.log(response);
				}
			});
		},

		events : {
			"change #hash-form" : "findTweetsByName"
		},

		findTweetsByName : function(){
			var key = $('#hash-form :selected').text(),
			tweets = _.filter($.jStorage.get('tweetText'),function(comp){
				return comp.name === key;
			}),
			tagsTweets = $(this.$el.find("#tags-tweets")[0]);	

			tagsTweets.html("");

			$.each(tweets[0].tweets,function(index, data){
				tagsTweets.append(new TRACKER.Views.Tweetlist({model:data}).el);
			});			
		}

	});


	TRACKER.Views.ListOptions = Backbone.View.extend({

		tagName : 'option',

		initialize : function(){
			this.render();
		},

		render : function(){
			$(this.el).html(this.model);			
			this.$el.attr('value',this.model);
			return this;
		}
	});


	TRACKER.Views.Tweetlist = Backbone.View.extend({

		tagName : 'li',

		className : "list-group-item",

		initialize : function(){
			this.render();
		},

		render : function(){
			// this.model.text = this.urlify(this.model.text);			
			if(this.model.parsed === "False"){
				this.model.text = this.model.text.parseURL().parseHashtag().parseUsername();
				this.model.parsed = "True";
			}
			
			$(this.el).html(this.template(this.model));			
			
			return this;
		}
	});

	
}(document, this, jQuery, Backbone, _));			