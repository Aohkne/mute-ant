# auth/config.py
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask config
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
    DEBUG = os.getenv('DEBUG', 'False').lower() in ('true', '1', 't')

    # JWT config
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'default-jwt-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES_HOURS', 1)))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=int(os.getenv('JWT_REFRESH_TOKEN_EXPIRES_DAYS', 30)))

    # MongoDB config
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
    MONGODB_DB_NAME = os.getenv('MONGODB_DB_NAME', 'default_db_name')
