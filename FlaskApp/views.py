import os, datetime, json
import analytics
from FlaskApp import FlaskApp
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


@FlaskApp.route('/get/top/hashtag/tweets', methods=['GET'])
def top_hashtag_tweets():
	top_tweets = analytics.hashtag_tweets()
	
	if top_tweets is not None:
		return jsonify({"tag_tweets" :top_tweets}), 200
	else :
		return jsonify({"tag_tweets" : {}}), 404		