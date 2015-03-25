import os
import operator
import json
import cPickle
import re
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import RandomForestClassifier


# __file__ refers to the file settings.py 
APP_ROOT = os.path.dirname(os.path.abspath(__file__))


tweets_data_path =  os.path.join(APP_ROOT, 'data.json')

#print tweets_data_path

#print tweets_data_path
def load_tweets():    
  tweets_data = []
  print "Loading tweets"  
  tweets_file = open(tweets_data_path, "r")           # opens file
  for line in tweets_file:                            # for each line in the file
      try:
        tweet = json.loads(line)                      # conver to json
        if tweet['id'] and tweet['text'] is not None: # we only want valid tweets
          if tweet['lang'] == 'en' :                  # and tweets that are only in english
            tweets_data.append(tweet)        
      except Exception, e:
        print e
  return tweets_data
  print "tweets loaded"


def word_in_text(word, text):
  word = word.lower()
  text = text.lower()
  match =  re.search(word,text)
  if match:
    return True
  return False

def term_in_tweet(word, text):
  word = word.lower()
  text = text.lower()
  match =  re.search(word,text)
  if match:
    return text
  return "null"  


def list_to_json(list):

  list = []
  l = {}
  for l in list:
    l['obj'] = obj.__dict__
    list.append(l)
  return json.dumps(list, separators=(',',':'))


######################################################################################################
#Function    : pop_hashtags
#Description : This is the main function for python script which processes the tweets for frequency 
#              frequency distriibution              
######################################################################################################

def pop_hashtags_list():  
  tweets_data = load_tweets() 
  result = []
  k = []
  v = []
  tweet_hash = {}                                     # Define a dictionary for keeping the hashtags as keys and their frequency as values 
  for tweet in tweets_data:                           # Loop for every tweet in the tweets file    
    if "entities" in tweet.keys():                    # Check whether entities tags present
      hashtags = tweet["entities"]["hashtags"]        #  - if present then extract the hashtags
      for ht in hashtags:                             # For every hashtag get the hashtag text value
        if ht != None:                                
          if ht["text"].encode("utf-8") in tweet_hash.keys():  # Check whether hashtag already in dictionary
            tweet_hash[ht["text"].encode("utf-8")] += 1        # - If it is then increment its frequency by 1 
          else:
            tweet_hash[ht["text"].encode("utf-8")] = 1         # - Else initialise the hashtag with frequency as 1
 
  sortedHashTags = dict(sorted(tweet_hash.items(), key=operator.itemgetter(1), reverse=True)[:10]) # Filter the top ten tweets  
  
  temp = sorted(sortedHashTags.items(), key=lambda kv: (kv[1],kv[0]),reverse=True)  # - based on the frequency(descending order)                                            
  for key,value in temp:
    k.append(key)
    v.append(value)   
  result.append(k)  
  result.append(v)  
  return result

def pop_hashtags():  
  tweets_data = load_tweets() 
  tweet_hash = {}                                     # Define a dictionary for keeping the hashtags as keys and their frequency as values 
  for tweet in tweets_data:                           # Loop for every tweet in the tweets file    
    if "entities" in tweet.keys():                    # Check whether entities tags present
      hashtags = tweet["entities"]["hashtags"]        #  - if present then extract the hashtags
      for ht in hashtags:                             # For every hashtag get the hashtag text value
        if ht != None:                                
          if ht["text"].encode("utf-8") in tweet_hash.keys():  # Check whether hashtag already in dictionary
            tweet_hash[ht["text"].encode("utf-8")] += 1        # - If it is then increment its frequency by 1 
          else:
            tweet_hash[ht["text"].encode("utf-8")] = 1         # - Else initialise the hashtag with frequency as 1
 
  sortedHashTags = dict(sorted(tweet_hash.items(), key=operator.itemgetter(1), reverse=True)[:10]) # Filter the top ten tweets  
  
  return sorted(sortedHashTags.items(), key=lambda kv: (kv[1],kv[0]),reverse=True)  # - based on the frequency(descending order)                                            




def top_relevant_tweets():
  tweets_data = load_tweets()
  tweet_hash = pop_hashtags()
  tweets = pd.DataFrame()
  result = []
  k = []
  v = []
  c = []
  
  tweets['text'] = map(lambda tweet: tweet['text'], tweets_data)  
  for key,value in tweet_hash:
    tweets[key] = tweets['text'].apply(lambda tweet: word_in_text(key, tweet))
  for key,value in tweet_hash:
    k.append(key)
    v.append(value) 
    c.append(tweets[key].value_counts()[True])  
  result.append(k)  
  result.append(c)  
  result.append(v)  
  return result




def hashtag_tweets():
  tweets_data = load_tweets()  
  tweet_hash = pop_hashtags()
  tweets = pd.DataFrame()
  text_list = {}
  result = []
  
  tweets['text'] = map(lambda tweet: tweet['text'], tweets_data)  
  for key,value in tweet_hash:

    tweets[key] = tweets['text'].apply(lambda tweet: word_in_text(key, tweet))
    text_list[key] = tweets['text'].apply(lambda tweet: term_in_tweet(key, tweet))

  for key,value in tweet_hash:
    temp = []
    for tweet in text_list[key]:
      if tweet != "null":
        temp.append(tweet)
    hashtag = {
          "name"  : key,          
          "tweets" : temp
    }    
    result.append(hashtag)
  return result
