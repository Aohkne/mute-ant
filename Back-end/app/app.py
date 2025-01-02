from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes and origins

# MongoDB setup
client = MongoClient("mongodb://localhost:27017")
db = client["mute-ant"]
chat_history_collection = db["chat_history"]

@app.route('/api/saveChat', methods=['POST'])
def save_chat():
    data = request.json
    try:
        # Add timestamps
        data["createdAt"] = datetime.datetime.now()
        data["updatedAt"] = datetime.datetime.now()

        # Save to MongoDB
        chat_history_collection.insert_one(data)
        return jsonify({"message": "Chat history saved successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)