import json
import dateutil.parser, time, operator, re
from time import strftime
from datetime import datetime
from redis import Redis 

TWEET_SCORE = 32

def get_hashtags( tweet):  

    tweet_hash = {}                                 # Define a dictionary for keeping the hashtags as keys and their frequency as values 
                               
    if "entities" in tweet.keys():                  # Check whether entities tags present
        hashtags = tweet["entities"]["hashtags"]    #  - if present then extract the hashtags
        for ht in hashtags:                         # For every hashtag get the hashtag text value
            if ht != None:                                
                if ht["text"].encode("utf-8").lower() in tweet_hash.keys():  	# Check whether hashtag already in dictionary
                    tweet_hash[ht["text"].encode("utf-8").lower()] += 1        	# - If it is then increment its frequency by 1 
                else:
                    tweet_hash[ht["text"].encode("utf-8").lower()] = 1         	# - Else initialise the hashtag with frequency as 1
 
    sortedHashTags = dict(sorted(tweet_hash.items(), key=operator.itemgetter(1), reverse=True)) # Filter the top tweets  

    return sorted(sortedHashTags.items(), key=lambda kv: (kv[1],kv[0]),reverse=True)  # - based on the frequency(descending order)


def date_to_unixtimestamp(_date):
  dt = dateutil.parser.parse(_date)
  print int(time.mktime(dt.timetuple()))
  return int(time.mktime(dt.timetuple()))


def word_in_text(word, text):
  word = word.lower()
  text = text.lower()
  match =  re.search(word,text)
  if match:
    return True
  return False


def add_to_hashList(conn, text, tweet_id, timestamp):
	zset = 'hashtagsFreq:'
	numberHahstags = conn.zcard(zset)
	hashtags = conn.zrange(zset,0,numberHahstags)
	print 'lets check if the hts terms apper in the tweet'
	for ht in hashtags:
		if word_in_text(ht,text):
			print "found " + ht +" in tweet"
			conn.zadd('hashtags:'+ht, tweet_id, timestamp)	


def add_tweet(conn, tweet):
	# extracting twitter to use in our database
	tweet_id = str(tweet['id']) 
	# get all the hashtags assiciated with the tweet
	hashtagsList = get_hashtags(tweet)
	# get the time the tweet was created to use 
	# as the score 
	timestamp = date_to_unixtimestamp(tweet['created_at'])

	hashtagsFreq = 'hashtagsFreq:'
	hashtag = 'hashtags:'
	tweetTime = 'tweetTime:'
	try:
		# if there are hashtags in the hashtagsList
		if hashtagsList:
			# for each key and value
			for key,value in hashtagsList:	
				# zincrby adds a new hashtag if it does not 
				# exists and gives it a default score of one
				# else it will incriment the current score of the hashtag
				# we will be able to get the most popular hashtag used 
				# in all of the tweets store by time	
				# 
				conn.zincrby(hashtagsFreq,key,TWEET_SCORE)
				# add the tweet associated with the hashtag in another
				# sorted set and use its timestamp as the score
				# 
				conn.zadd(hashtag+key, tweet_id, timestamp)					
				print "added to " + key
				print conn.zscore(hashtagsFreq, key)

			# we still want to add the tweet to a hash
			# if the hashtag term appears in the tweet
			print 'Checking for other terms..'
			add_to_hashList(conn,tweet['text'], tweet_id, timestamp)
		else:
			# 
			# the tweet did not contain any hashtags
			# we still want to add the tweet to a hash
			# if the hashtag term appears in the tweet
			print 'No hashtags found..'
			add_to_hashList(conn,tweet['text'], tweet_id, timestamp)
			# 
		# finally we add the actual tweet byt time
		# we can search this set if we desire to only
		# get tweets by time
		conn.zadd(tweetTime,tweet_id, timestamp)
		# create a hash map to store the tweet
		conn.hmset('tweet:'+tweet_id,tweet)
	except Exception, e:
		print e
		raise	
	return tweet_id