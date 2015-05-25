import json, ast
import dateutil.parser, time, operator, re
import pandas as pd
from time import strftime
from datetime import datetime
from dateutil import rrule
from redis import Redis


ONE_WEEK_IN_SECONDS = 7 * 86400

ONE_DAY_IN_SECONDS = 86400

# def weeks_between(start_date, end_date):
# 	end_date = datetime.fromtimestamp(end_date)
# 	start_date = datetime.fromtimestamp(start_date)
# 	weeks = rrule.rrule(rrule.WEEKLY, dtstart=start_date, until=end_date)
# 	return weeks.count()


def get_hashtag_list():
	conn = Redis()
	hash_list = conn.keys('hashtags:*')
	hash_dict = []
	for hashtag in hash_list:
		h = hashtag.split(":")
		hash_dict.append(h[1])		
	return sorted(hash_dict)


def number_of_weeks():
	conn = Redis()	
	end = time.time()
	start = conn.zrangebyscore('tweetTime:','-inf','+inf',0,1,True)[0][1]
	week_start = []
	while start < end:
		temp = {
			"unix":start, 
			"datetime": datetime.fromtimestamp(start).strftime("%B %d, %Y")
		}
		week_start.append(temp)
		start += ONE_WEEK_IN_SECONDS
	if end - start > 0:
		start = start + (end - start)
		temp = {
			"unix":start, 
			"datetime": datetime.fromtimestamp(start).strftime("%B %d, %Y")
		}
	else :
		start -= ONE_WEEK_IN_SECONDS
		start = start + (end - start)
		temp = {
			"unix":start, 
			"datetime": datetime.fromtimestamp(start).strftime("%B %d, %Y")
		}
	week_start.append(temp)
	week_start.pop(0)
	return week_start[::-1]

def term_in_tweet(word, tweet):
  word = word.lower()
  text = tweet['text'].lower()
  match =  re.search(word,text)
  if match:    
    return tweet["sentiment"]
  return "null" 


def get_tweetId_by_time(start_date=None, end_date=None):
	start_date =  time.time() - ONE_WEEK_IN_SECONDS if start_date is None else start_date
	end_date =  time.time() if end_date is None else end_date
	conn = Redis()	
	tweet_id_list = conn.zrangebyscore('tweetTime:',start_date,end_date)	
	tweets = []
	for id in tweet_id_list:
		tweet = conn.hgetall('tweet:'+id)
		tweets.append(tweet)
	return tweets


def get_hash_assiciation(start_date=None, end_date=None, hashtag='trinidad'):
	start_date =  time.time() - ONE_WEEK_IN_SECONDS if start_date is None else start_date
	end_date =  time.time() if end_date is None else end_date
	conn = Redis()	
	tweet_id_list = conn.zrangebyscore('hashtags:'+hashtag,start_date,end_date)
	hashtags = {}
	count = 0
	for id in tweet_id_list:
		tags = conn.zrangebyscore('tweetId:'+id,start_date,end_date)
		for t in tags:
			if count < 8:	
				if t != hashtag:						
					if t in hashtags.keys():
						hashtags[t] += 1
					else :
						hashtags[t] = 1	
						count += 1
			else :
				break
	obj = {
		"hashtag" 		: hashtag,
		"assoication" 	: hashtags
	}
	return obj


def get_hashtags_list_association(start_date=None, end_date=None, limit=10):
	hashtags = get_top_hashtags_by_time(start_date,end_date,limit)	
	hash_list = []
	for htg in hashtags:
		assoication = get_hash_assiciation(start_date,end_date,htg[0])
		hash_list.append(assoication)
	return hash_list


def get_top_hashtags_by_time(start_date=None, end_date=None, limit=10):
	start_date =  time.time() - ONE_WEEK_IN_SECONDS if start_date is None else start_date
	end_date =  time.time() if end_date is None else end_date
	tweets_data = get_tweetId_by_time(start_date,end_date)	
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
	return temp


def get_hashtag_tweet_count_by_time(start_date=None, end_date=None, hashtag='trinidad'):
	start_date =  time.time() - ONE_WEEK_IN_SECONDS if start_date is None else start_date
	end_date =  time.time() if end_date is None else end_date
	tweets_data = get_tweetId_by_time(start_date,end_date)	
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


def track_hashtag_freq(hashtag='trinidad'):
	conn = Redis()	
	end = time.time()
	start = conn.zrangebyscore('hashtags:'+hashtag,'-inf','+inf',0,1,True)[0][1]	
	hashtag_freq = []
	_date = []
	freq = []
	while start < end:		
		temp = start + ONE_WEEK_IN_SECONDS # get one week later
		num_hash_per_week = get_hashtag_tweet_count_by_time(start,temp,hashtag)	
		_date.append(datetime.fromtimestamp(start).strftime("%B %d, %Y"))	
		freq.append(num_hash_per_week[hashtag])			
		start+=ONE_WEEK_IN_SECONDS
	hashtag_freq.append({
			"date":_date,
			"data":[{"name":"freq", "data" : freq}]})
	return hashtag_freq


def track_hashtag_freq_ind(hashtag='trinidad'):
	conn = Redis()	
	end = time.time()
	start = conn.zrangebyscore('hashtags:'+hashtag,'-inf','+inf',0,1,True)[0][1]	
	hashtag_freq = []
	_date = []
	freq = []
	while start < end:		
		temp = start + ONE_WEEK_IN_SECONDS # get one week later
		num_hash_per_week = get_hashtag_tweet_count_by_time(start,temp,hashtag)			
		freq.append({
			"x" : datetime.fromtimestamp(start).strftime("%s"),
			"y" : num_hash_per_week[hashtag],
			"name" : hashtag
			})			
		start+=ONE_WEEK_IN_SECONDS
	hashtag_freq.append({
			"name":hashtag,
			"freq":freq})
	return hashtag_freq



def hashtag_dates(hashtag='trinidad'):
	conn = Redis()
	end = time.time()
	start = conn.zrangebyscore('hashtags:'+hashtag,'-inf','+inf',0,1,True)[0][1]	
	_date = []	
	while start < end:		
		temp = start + ONE_WEEK_IN_SECONDS # get one week later						
		_date.append({
			"unix":start, 
			"datetime": datetime.fromtimestamp(start).strftime("%B %d, %Y")
		})
		start+=ONE_WEEK_IN_SECONDS

	return _date[::-1]		



def get_sentiment_of_hashtag_by_time(start_date=None, end_date=None, hashtag='trinidad'):
	start_date =  time.time() - ONE_WEEK_IN_SECONDS if start_date is None else start_date
	end_date =  time.time() if end_date is None else end_date
	tweets_data = get_tweetId_by_time(start_date,end_date)		

	tweet_hash = {
		"pos" : 0,
		"neg" : 0
	}   
	
	sentiments = map(lambda tweet:term_in_tweet(hashtag,tweet),tweets_data)
	for s in sentiments:
		if s != "null":			
			if int(s) == 4:
				tweet_hash['pos']+=1
			else:						
				tweet_hash['neg']+=1   	
	tweet_hash['neg'] *= -1
	return tweet_hash	



def track_hashtag_sentiment(hashtag='trinidad'):
	conn = Redis()	
	end = time.time()
	start = conn.zrangebyscore('hashtags:'+hashtag,'-inf','+inf',0,1,True)[0][1]	
	hashtag_freq = []
	_date = []
	pos = []
	neg = []
	while start < end:		
		temp = start + ONE_WEEK_IN_SECONDS # get one week later
		hash_sentiment_per_week = get_sentiment_of_hashtag_by_time(start,temp,hashtag)	
		_date.append(datetime.fromtimestamp(start).strftime("%B %d, %Y"))	
		pos.append(hash_sentiment_per_week['pos'])
		neg.append(hash_sentiment_per_week['neg'])
		start+=ONE_WEEK_IN_SECONDS

	hashtag_freq.append({
			"date":_date,			
			"data": [{"name" : "pos", "data":pos},{"name" : "neg", "data":neg}]})
	return hashtag_freq



def track_hashtag_sentiment_ind(hashtag='trinidad'):
	conn = Redis()	
	end = time.time()
	start = conn.zrangebyscore('hashtags:'+hashtag,'-inf','+inf',0,1,True)[0][1]	
	hashtag_freq = []
	_date = []
	pos = []
	neg = []
	while start < end:		
		temp = start + ONE_WEEK_IN_SECONDS # get one week later
		hash_sentiment_per_week = get_sentiment_of_hashtag_by_time(start,temp,hashtag)			
		pos.append({
			"x" : datetime.fromtimestamp(start).strftime("%s"),
			"y"	: hash_sentiment_per_week['pos'],
			"name" : hashtag
		})
		neg.append({
			"x" : datetime.fromtimestamp(start).strftime("%s"),
			"y"	: hash_sentiment_per_week['neg']*-1,
			"name" : hashtag
		})
		start+=ONE_WEEK_IN_SECONDS

	hashtag_freq.append({
			"name" : hashtag,
			"pos" : pos,
			"neg" : neg})
	return hashtag_freq


def get_top_hash_sentiment_by_time(start, end, limit):
	hashtags = get_top_hashtags_by_time(start, end, limit)
	htgs = []
	pos = []
	neg = []

	for ht in hashtags:
		sentiment = get_sentiment_of_hashtag_by_time(start, end, ht[0])
		htgs.append(ht[0])
		pos.append(sentiment['pos'])
		neg.append(sentiment['neg'])

	return {
		"hashtags" : htgs,
		"positive" : pos,
		"negative" : neg
	}


def tweet_text_by_time_hash(start_date=None, end_date=None, hashtag='ttps'):
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
