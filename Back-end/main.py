from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .config import Config
from .auth.routes import auth_bp

def create_app():
    app = Flask(__name__)
    
    # Load config
    app.config.from_object(Config)
    
    # Initialize extensions
    CORS(app)
    JWTManager(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)