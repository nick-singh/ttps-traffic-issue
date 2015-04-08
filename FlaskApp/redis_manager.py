import json, ast
import dateutil.parser, time, operator, re
from time import strftime
from datetime import datetime
from dateutil import rrule
from redis import Redis


ONE_WEEK_IN_SECONDS = 7 * 86400

def weeks_between(start_date, end_date):
	end_date = datetime.fromtimestamp(end_date)
	start_date = datetime.fromtimestamp(start_date)
	weeks = rrule.rrule(rrule.WEEKLY, dtstart=start_date, until=end_date)
	return weeks.count()


def get_tweets_by_time(start_date=None, end_date=None):
	start_date =  time.time() - ONE_WEEK_IN_SECONDS if start_date is None else start_date
	end_date =  time.time() if end_date is None else end_date
	conn = Redis()	
	tweet_id_list = conn.zrangebyscore('tweetTime:',start_date,end_date)	
	tweets = []
	for id in tweet_id_list:
		tweet = conn.hgetall('tweet:'+id)
		tweets.append(tweet)
	return tweets


def get_top_hashtags_by_time(start_date=None, end_date=None, limit=None):
	start_date =  time.time() - ONE_WEEK_IN_SECONDS if start_date is None else start_date
	end_date =  time.time() if end_date is None else end_date
	tweets_data = get_tweets_by_time(start_date,end_date)	
	result = []
	k = []
	v = []
	tweet_hash = {}                                     # Define a dictionary for keeping the hashtags as keys and their frequency as values 
	for tweet in tweets_data:                           # Loop for every tweet in the tweets file    		
		if "entities" in tweet.keys():                  # Check whether entities tags present
			_hash = ast.literal_eval(tweet["entities"])['hashtags']
			hashtags = _hash        					#  - if present then extract the hashtags
			for ht in hashtags:                         # For every hashtag get the hashtag text value
				if ht != None:                                
					if ht["text"].encode("utf-8").lower() in tweet_hash.keys():  # Check whether hashtag already in dictionary
						tweet_hash[ht["text"].encode("utf-8").lower()] += 1        # - If it is then increment its frequency by 1 
					else:
						tweet_hash[ht["text"].encode("utf-8").lower()] = 1         # - Else initialise the hashtag with frequency as 1

	sortedHashTags = dict(sorted(tweet_hash.items(), key=operator.itemgetter(1), reverse=True)[:limit]) # Filter the top ten tweets  

	temp = sorted(sortedHashTags.items(), key=lambda kv: (kv[1],kv[0]),reverse=True)  # - based on the frequency(descending order)                                            
	for key,value in temp:
		k.append(key)
		v.append(value)   
	result.append(k)  
	result.append(v)  
	return result


def get_hashtag_by_time(start_date=None, end_date=None, hashtag='trinidad'):
	start_date =  time.time() - ONE_WEEK_IN_SECONDS if start_date is None else start_date
	end_date =  time.time() if end_date is None else end_date
	tweets_data = get_tweets_by_time(start_date,end_date)	
	result = []
	k = []
	v = []
	tweet_hash = {
		hashtag.lower() : 0
	}                                     # Define a dictionary for keeping the hashtags as keys and their frequency as values 
	for tweet in tweets_data:                           # Loop for every tweet in the tweets file    		
		if "entities" in tweet.keys():                  # Check whether entities tags present
			_hash = ast.literal_eval(tweet["entities"])['hashtags']
			hashtags = _hash        					#  - if present then extract the hashtags
			for ht in hashtags:                         # For every hashtag get the hashtag text value
				if ht != None:                                
					if ht["text"].encode("utf-8").lower() == hashtag.lower():  # Check whether hashtag already in dictionary
						tweet_hash[hashtag.lower()] += 1        # - If it is then increment its frequency by 1 					  
	return tweet_hash


def track_hashtag_freq(hashtag='trinidadexpress'):
	conn = Redis()	
	end = time.time()
	start = conn.zrangebyscore('hashtags:'+hashtag,'-inf','+inf',0,1,True)[0][1]	
	hashtag_freq = []
	while start < end:		
		temp = start + ONE_WEEK_IN_SECONDS # get one week later
		num_hash_per_week = get_hashtag_by_time(start,temp,hashtag)		
		hashtag_freq.append({
			"start":datetime.fromtimestamp(start),
			"end":datetime.fromtimestamp(temp), 
			"freq": num_hash_per_week[hashtag]})		
		start+=ONE_WEEK_IN_SECONDS
	return hashtag_freq



def get_sentiment_of_hashtag_by_time(start_date=None, end_date=None, hashtag='trinidad'):
	start_date =  time.time() - ONE_WEEK_IN_SECONDS if start_date is None else start_date
	end_date =  time.time() if end_date is None else end_date
	tweets_data = get_tweets_by_time(start_date,end_date)	
	result = []
	k = []
	v = []
	tweet_hash = {
		"pos" : 0,
		"neg" : 0
	}                                     # Define a dictionary for keeping the hashtags as keys and their frequency as values 
	for tweet in tweets_data:                           # Loop for every tweet in the tweets file    		
		if "entities" in tweet.keys():                  # Check whether entities tags present
			_hash = ast.literal_eval(tweet["entities"])['hashtags']
			hashtags = _hash        					#  - if present then extract the hashtags
			for ht in hashtags:                         # For every hashtag get the hashtag text value
				if ht != None:                                
					if ht["text"].encode("utf-8").lower() == hashtag.lower():  # Check whether hashtag already in dictionary
						sentiment = int(tweet['sentiment'])  
						if sentiment > 0:
							tweet_hash['pos']+=1
						else:						
							tweet_hash['neg']+=1  
	return tweet_hash	



def track_hashtag_sentiment(hashtag='trinidadexpress'):
	conn = Redis()	
	end = time.time()
	start = conn.zrangebyscore('hashtags:'+hashtag,'-inf','+inf',0,1,True)[0][1]	
	hashtag_freq = []
	while start < end:		
		temp = start + ONE_WEEK_IN_SECONDS # get one week later
		hash_sentiment_per_week = get_sentiment_of_hashtag_by_time(start,temp,hashtag)		
		hashtag_freq.append({
			"start":datetime.fromtimestamp(start),
			"end":datetime.fromtimestamp(temp), 
			"pos": hash_sentiment_per_week['pos'],
			"neg": hash_sentiment_per_week['neg']})
		start+=ONE_WEEK_IN_SECONDS
	return hashtag_freq


def tweet_text_by_time_hash(start_date=None, end_date=None, hashtag='trinidad'):
	start_date =  time.time() - ONE_WEEK_IN_SECONDS if start_date is None else start_date
	end_date =  time.time() if end_date is None else end_date
	conn = Redis()
	ids = conn.zrangebyscore('hashtags:'+hashtag,start_date,end_date)
	tweets = []
	for id in ids:
		tweet = conn.hgetall('tweet:'+id)
		# turn the date string into a date object that python can handle
		timestamp = time.strptime(tweet["created_at"], "%a %b %d %H:%M:%S +0000 %Y")
		temp = {
			"id"		: id,
			"text"      : tweet['text'],
			"timestamp" : datetime.fromtimestamp(time.mktime(timestamp)),
			"sentiment"	: tweet['sentiment']	
		}
		tweets.append(temp)		
	return tweets


# print get_tweets_by_time()
# print track_hashtag_freq()	
# print track_hashtag_sentiment()	

print tweet_text_by_time_hash()