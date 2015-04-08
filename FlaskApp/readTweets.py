# This file will be used to read in all the tweets into whatever database that will be used
# For now all it does is read in the tweets and put them into a tweets object with its processed 
# sentiment.

from twitter_classifier import TwitterClassifier
import os,operator,json,cPickle,re,time
import dateutil.parser
import redis_db
from time import strftime
from datetime import datetime
from redis import Redis
# __file__ refers to the file settings.py 
APP_ROOT = os.path.dirname(os.path.abspath(__file__))


js_tweet_data_path =  os.path.join(APP_ROOT, 'data.json')

def load_js_tweet(): 
  conn = Redis()   
  js_tweet_data = []
  twitterClassifier = TwitterClassifier()
  print "Loading js_tweet"  
  js_tweet_file = open(js_tweet_data_path, "r")       # opens file
  for line in js_tweet_file:                          # for each line in the file
      try:
        tweet = json.loads(line)                      # conver to json
        if tweet['id'] and tweet['text'] is not None: # we only want valid js_tweet
          if tweet['lang'] == 'en' :                  # and js_tweet that are only in english
            if "ttps://" not in tweet['text']:

              if '#Trinidad Express' in tweet['text']: # If Trinidad Express is in the tweet
                # We want to replace #Trinidad Express with #TrinidadExpress 
                # Mainly because it proves to be a miss representation of the hashtags tweeted
                tweet['text'] = tweet['text'].replace('#Trinidad Express', '#TrinidadExpress')

                if "entities" in tweet.keys():                    # Check whether entities tags present
                  hashtags = tweet["entities"]["hashtags"]
                  for ht in hashtags:
                    if ht is not None:                      
                      if ht["text"].encode("utf-8").lower() == 'trinidad':
                        ht["text"] = 'TrinidadExpress'            
              tweet['sentiment'] = twitterClassifier.get_sentiment(tweet['text'])
              print redis_db.add_tweet(conn, tweet)
              js_tweet_data.append(tweet)        
      except Exception, e:
        print e
  return js_tweet_data
  print "tweets loaded"



def store_and_process_tweet(tweet):
  if tweet['id'] and tweet['text'] is not None: # we only want valid js_tweet
    if tweet['lang'] == 'en' :                  # and js_tweet that are only in english
      if "ttps://" not in tweet['text']:

        if '#Trinidad Express' in tweet['text']:
          tweet['text'] = tweet['text'].replace('#Trinidad Express', '#TrinidadExpress')

          if "entities" in tweet.keys():                    # Check whether entities tags present
            hashtags = tweet["entities"]["hashtags"]
            for ht in hashtags:
              if ht is not None:                      
                if ht["text"].encode("utf-8").lower() == 'trinidad':
                  ht["text"] = 'TrinidadExpress'            
        tweet['sentiment'] = twitterClassifier.get_sentiment(tweet['text'])
        print redis_db.add_tweet(conn, tweet)
        js_tweet_data.append(tweet)


def date_to_unixtimestamp(_date):
  dt = dateutil.parser.parse(_date)
  return int(time.mktime(dt.timetuple()))


load_js_tweet()
# print load_js_tweet()[3].hashtags
# for tweet in load_js_tweet():
# 	print tweet['sentiment']