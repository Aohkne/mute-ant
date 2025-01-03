# auth/controllers.py
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, create_access_token
from werkzeug.security import check_password_hash
from .services import AuthService

auth_service = AuthService()

def register():
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['username', 'email', 'password']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        result, status_code = auth_service.register_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def login():
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password are required"}), 400

        # Verify password hash
        stored_user = auth_service.get_user_by_email(data['email'])  # Assuming this method retrieves the user
        if not stored_user or not check_password_hash(stored_user['password'], data['password']):
            return jsonify({"error": "Invalid email or password"}), 401

        result, status_code = auth_service.login_user(
            email=data['email'],
            password=data['password']
        )
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def logout():
    try:
        return jsonify({"message": "Successfully logged out"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def refresh():
    try:
        current_user = get_jwt_identity()
        if not current_user:
            return jsonify({"error": "Invalid or expired token"}), 401

        new_access_token = create_access_token(identity=current_user)
        return jsonify({"access_token": new_access_token}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
