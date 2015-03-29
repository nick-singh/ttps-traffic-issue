import json
import csv
import os
import re
import cPickle
import nltk
from nltk.corpus import stopwords
from bs4 import BeautifulSoup


# __file__ refers to the file settings.py 
APP_ROOT = os.path.dirname(os.path.abspath(__file__))

# tweets_data_path =  os.path.join(APP_ROOT, 'data-sets/testdata.manual.2009.06.14.csv')
# # tweets_data_path =  os.path.join(APP_ROOT, 'training.1600000.processed.noemoticon.csv')

# twitter_data = csv.reader(open(tweets_data_path,'rb'))

# twitter_data = map(tuple,twitter_data)

pickleFile = os.path.join(APP_ROOT, 'data-sets/500-data-sets/500_classifier.pickle')


def get_words_in_tweets(tweets):
	all_words = []
	for(words,sentiment) in tweets:
		all_words.extend(words)
	return all_words

def get_word_features(wordlist):
	wordlist = nltk.FreqDist(wordlist)
	word_features = wordlist.keys()
	return word_features


def tweet_to_words( raw_tweet ):
    # Function to convert a raw tweet to a string of words
    # The input is a single string (a raw movie tweet), and 
    # the output is a single string (a preprocessed movie tweet)
    #
    # 1. Remove HTML
    tweet_text = BeautifulSoup(raw_tweet).get_text() 
    #
    # 2. Remove non-letters        
    letters_only = re.sub("[^a-zA-Z]", " ", tweet_text) 
    #
    # 3. Convert to lower case, split into individual words
    words = letters_only.lower().split()                             
    #
    # 4. In Python, searching a set is much faster than searching
    #   a list, so convert the stop words to a set
    stops = set(stopwords.words("english"))                  
    # 
    # 5. Remove stop words
    meaningful_words = [w for w in words if not w in stops]   
    #
    # 6.  return the result.
    return meaningful_words

# Function accepts list of words and clean each row
def clean_list_of_words(list_of_words):
    
    # Get the number of tweets based on the datagrame column size
    num_tweets = len(list_of_words)
    #
    # Initialize an empty list to hold the clean tweets  
    clean_train_words = []  
    #
    print "Cleaning and parsing the training set items...\n"
    
    for i in xrange( 0, num_tweets ):
        # If the index is evenly divisible by 1000, print a messagegoo
        if( (i+1)%1000 == 0 ):
            print "item %d of %d\n" % ( i+1, num_tweets )                                                                    
        clean_train_words.append((tweet_to_words(list_of_words[i][5]),list_of_words[i][0]))
    return clean_train_words

def extract_features(document):
    document_words = set(document)
    word_features = json.load(open('data-sets/500-data-sets/500_features.json','r'))
    features = {}
    for word in word_features:
        features['contains(%s)' % word] = (word in document_words)
    return features


def classify_tweet(tweet):
    clean_tweet = tweet_to_words(tweet)
    classifier =  cPickle.load(open(pickleFile, 'rb'))    
    return classifier.classify(extract_features(clean_tweet))


def classify_tweet_list(tweet_list):
    sentiment = {
        "neg"   : 0,
        "pos"   : 0
    }

    for tweet in tweet_list:
        senti = classify_tweet(tweet['text'])
        if int(senti) == 0:
            sentiment['neg'] += 1
        else :
            sentiment['pos'] += 1
    return sentiment


# tweet_list = [
#     {"created_at":"Mon Mar 23 22:25:22 +0000 2015","id":580133263064203264,"text":"If TTPS so bad with all the chat. Hold the country under siege for the whole week. Waste of time hongs only got mouth and lies."},
#     {"created_at":"Mon Mar 23 22:26:09 +0000 2015","id":580133458724302848,"text":"If I had the powers, I'd fire the entire executive of the TTPS"},
#     {"created_at":"Mon Mar 23 22:27:20 +0000 2015","id":580133755882332160,"text":"RT @TeamTrini_Bago: What crime did the TTPS solve today? @tv6tnt and We agree a lot of respect is lost for the #TTPS. #TeamTrini"}
# ]

# print classify_tweet_list(tweet_list)

