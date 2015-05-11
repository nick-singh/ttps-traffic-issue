from flask import Flask

FlaskApp = Flask(__name__, static_url_path = "")


import os, datetime, json
import redis_manager, analytics
from flask import jsonify, abort, make_response, request, url_for
from flask.ext.httpauth import HTTPBasicAuth



@FlaskApp.route('/')
def root():
    return FlaskApp.send_static_file('index.html')



@FlaskApp.route('/get/popular/hashtags', methods=['GET'])
def popular_hashtags():
	hashs = analytics.pop_hashtags_list()	
	if hashs is not None:
		return jsonify({"hash" : hashs}), 200
	else :
		return jsonify({"hash" : {}}), 404


@FlaskApp.route('/get/top/relevant/tweets', methods=['GET'])
def top_tweets():
	top_tweets = analytics.top_relevant_tweets()
	
	if top_tweets is not None:
		return jsonify({"top_tweets" :top_tweets}), 200
	else :
		return jsonify({"top_tweets" : {}}), 404		


# @FlaskApp.route('/get/top/hashtag/tweets/<key>/<start>/<offset>', methods=['GET'])
# def top_hashtag_tweets(key,start,offset):
# 	top_tweets = analytics.hashtag_tweets(key,start,offset)
	
# 	if top_tweets is not None:
# 		return jsonify({"tag_tweets" :top_tweets}), 200
# 	else :
# 		return jsonify({"tag_tweets" : {}}), 404		

@FlaskApp.route('/get/top/hashtag/tweets', methods=['GET'])
def top_hashtag_tweets():
	top_tweets = analytics.hashtag_tweets()
	
	if top_tweets is not None:
		return jsonify({"tag_tweets" :top_tweets}), 200
	else :
		return jsonify({"tag_tweets" : {}}), 404	


# New Services...		

@FlaskApp.route('/get/top/hashtags/by/time/<start>/<end>/<limit>', methods=["GET"])
def get_top_hashtags_by_time(start, end, limit):
	hash_list = redis_manager.get_top_hashtags_by_time(start, end, int(limit))

	if hash_list is not None:
		return jsonify({"hashtags":hash_list}), 200
	else:
		return jsonify({"hashtags":{}}), 404


@FlaskApp.route('/get/top/sentiment/by/time/<start>/<end>/<limit>', methods=["GET"])
def get_top_hash_sentiment_by_time(start, end, limit):
	hash_list = redis_manager.get_top_hash_sentiment_by_time(start, end, int(limit))

	if hash_list is not None:
		return jsonify({"hashtags":hash_list}), 200
	else:
		return jsonify({"hashtags":{}}), 404


@FlaskApp.route('/get/hashtags/tweets/count/by/time/<start>/<end>/<hashtag>', methods=['GET'])		
def get_hashtag_tweet_count_by_time(start, end,hashtag):
	tweet_list = redis_manager.get_hashtag_tweet_count_by_time(start, end, hashtag)

	if tweet_list is not None:
		return jsonify({"tweets":tweet_list}), 200
	else:
		return jsonify({"tweets":{}}), 404


@FlaskApp.route('/get/hashtag/freq/preformance/<hashtag>', methods=["GET"])
def track_hashtag_freq(hashtag):
	hash_freq = redis_manager.track_hashtag_freq(hashtag)

	if hash_freq is not None:
		return jsonify({"hashtags":hash_freq}), 200
	else:
		return jsonify({"hashtags":{}}), 404


@FlaskApp.route('/get/sentiment/by/time/<start>/<end>/<hashtag>', methods=['GET'])		
def get_sentiment_of_hashtag_by_time(start, end,hashtag):
	sentiment = redis_manager.get_sentiment_of_hashtag_by_time(start, end, hashtag)

	if sentiment is not None:
		return jsonify({"sentiment":sentiment}), 200
	else:
		return jsonify({"sentiment":{}}), 404
		

@FlaskApp.route('/get/hashtag/sentiment/preformance/<hashtag>', methods=["GET"])
def track_hashtag_sentiment(hashtag):
	sentiment_freq = redis_manager.track_hashtag_sentiment(hashtag)

	if sentiment_freq is not None:
		return jsonify({"sentiment":sentiment_freq}), 200
	else:
		return jsonify({"sentiment":{}}), 404		


@FlaskApp.route('/get/tweet/text/by/time/<start>/<end>/<hashtag>', methods=["GET"])		
def tweet_text_by_time_hash(start, end, hashtag):
	tweet_list = redis_manager.tweet_text_by_time_hash(start, end, hashtag)

	if tweet_list is not None:
		return jsonify({"tweets":tweet_list}), 200
	else:
		return jsonify({"tweets":{}}), 404


@FlaskApp.route('/get/hashtag/association/by/time/<start>/<end>/<hashtag>', methods=["GET"])		
def get_hash_assiciation(start, end, hashtag):
	hashtags_list = redis_manager.get_hash_assiciation(start, end, hashtag)

	if hashtags_list is not None:
		return jsonify({"hashtags":hashtags_list}), 200
	else:
		return jsonify({"hashtags":{}}), 404	


@FlaskApp.route('/get/top/hashtags/association/by/time/<start>/<end>/<limit>', methods=["GET"])
def get_hashtags_list_association(start, end, limit):
	hash_list = redis_manager.get_hashtags_list_association(start, end, int(limit))

	if hash_list is not None:
		return jsonify({"hashtags":hash_list}), 200
	else:
		return jsonify({"hashtags":{}}), 404


if __name__ == "__main__":
    FlaskApp.run(debug=True)