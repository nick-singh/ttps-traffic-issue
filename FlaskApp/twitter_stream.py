#Import the necessary methods from tweepy library
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import json

#Variables that contains the user credentials to access Twitter API 
access_token = "717397609-eVR9kuq30tAhbY26NNpruYDgkimVdB185ciVYgFt"
access_token_secret = "Sx2vxEyh0GQgkQiBtTOyHockz5aEX6kPcKjDosrCFMX9O"
consumer_key = "96AQF2axAeEipYRYVKLk7pV88"
consumer_secret = "sR4boPFTcDxV8IRjjvUuZavMvoeZ2Hd2ob7ykNN3YTheaZz65H"


#This is a basic listener that just prints received tweets to stdout.
class StdOutListener(StreamListener):

    def on_data(self, data):
        print data
        dump_to_json('data.json',data)
        return True

    def on_error(self, status):
        print status

def exe_stream(term):

    if __name__ == '__main__':

        #This handles Twitter authetification and the connection to Twitter Streaming API
        l = StdOutListener()
        auth = OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_token, access_token_secret)
        stream = Stream(auth, l)

        #This line filter Twitter Streams to capture data by the keywords: 'python', 'javascript', 'ruby'
        stream.filter(track=term)

def dump_to_json(file_name_and_path, data):    
    f = open(file_name_and_path,'a')
    f.write(data) 
    f.close()


#exe_stream(["TTPS"])
exe_stream(["#TTPS","TTPS",
            "@cnewslive","@tv6tnt",
            "@expressupdates","#Trinidad Express", 
            "@GuardianTT" ,"T&T Guardian",
            "@TTMetOffice", "TTMetService",
            "@ctelevision", "@CNC3TV",
            "@iGovTT", "@newsgovtt", "@TTParliament",
            "@ODPM_TT", "@wintvworld"])
#exe_stream(["Trinidad"])
#exe_stream(["taylor swift"])
    
