from flask import Flask

# app = Flask(__name__)
FlaskApp = Flask(__name__, static_url_path = "")
from FlaskApp import views