# Install: pip install pymongo
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['mute-ant']
collection = db['user_account']