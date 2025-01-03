# auth/services.py
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_jwt_extended import create_access_token, create_refresh_token
from bson.objectid import ObjectId
from ..dbhelper.database import Database

class AuthService:
    def __init__(self):
        self.db = Database()

    def register_user(self, username, email, password):
        """Register a new user"""
        try:
            # Check if user exists
            if self.db.users.find_one({"email": email}):
                return {"error": "Email already registered"}, 400

            # Create new user
            hashed_password = generate_password_hash(password, method='sha256')
            new_user = {
                "username": username,
                "email": email,
                "password": hashed_password,
                "created_at": datetime.utcnow()
            }

            # Save to database
            result = self.db.users.insert_one(new_user)
            new_user['_id'] = str(result.inserted_id)

            # Remove password from response
            del new_user['password']

            return {"message": "Registration successful", "user": new_user}, 201
        except Exception as e:
            return {"error": str(e)}, 500

    def login_user(self, email, password):
        """Login a user"""
        try:
            user = self.db.users.find_one({"email": email})

            if not user or not check_password_hash(user['password'], password):
                return {"error": "Invalid email or password"}, 401

            # Create tokens
            access_token = create_access_token(identity=str(user['_id']))
            refresh_token = create_refresh_token(identity=str(user['_id']))

            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": {
                    "id": str(user['_id']),
                    "username": user['username'],
                    "email": user['email']
                }
            }, 200
        except Exception as e:
            return {"error": str(e)}, 500

    def get_user_by_id(self, user_id):
        """Get user by ID"""
        try:
            user = self.db.users.find_one({"_id": ObjectId(user_id)})
            if user:
                user['_id'] = str(user['_id'])
                del user['password']
                return user
            return None
        except Exception as e:
            return None

    def get_user_by_email(self, email):
        """Get user by email"""
        try:
            user = self.db.users.find_one({"email": email})
            if user:
                user['_id'] = str(user['_id'])
                return user
            return None
        except Exception as e:
            return None
