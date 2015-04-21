import json, os, re ,cPickle ,nltk
from nltk.corpus import stopwords
from bs4 import BeautifulSoup


# __file__ refers to the file settings.py 
APP_ROOT = os.path.dirname(os.path.abspath(__file__))

FEATURES = os.path.join(APP_ROOT,'larger-data-set/60000_features.json')

CLASSIFIER = os.path.join(APP_ROOT,'larger-data-set/60000_classifier.pickle')



class TwitterClassifier():
	"""docstring for TwitterClassifier"""
	def __init__(self):		
		self.features = json.load(open(FEATURES,'r'))
		self.classifier = cPickle.load(open(CLASSIFIER, 'rb'))

	features = None
	classifier = None


	def get_sentiment(self, tweet):
		print "Predicting sentiment.."
		clean_text = self.tweet_to_words(tweet)
		return self.classifier.classify(self.extract_features(clean_text))


	def get_words_in_tweets(self, tweets):
		all_words = []
		for(words,sentiment) in tweets:
			all_words.extend(words)
		return all_words

	def get_word_features(self, wordlist):
		wordlist = nltk.FreqDist(wordlist)
		word_features = wordlist.keys()
		return word_features


	def tweet_to_words(self, raw_tweet ):		
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
	    # Removing the word RT
	    words = [x for x in words if x != "rt"]                      
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
	def clean_list_of_words(self, list_of_words):
	    
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


	def extract_features(self, document):
	    document_words = set(document)
	    features = {}
	    for word in self.features:
	        features['contains(%s)' % word] = (word in document_words)
	    return features
