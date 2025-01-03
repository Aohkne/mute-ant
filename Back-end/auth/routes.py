from flask import Blueprint
from flask_jwt_extended import jwt_required
from .controllers import (
    register, login, logout, refresh,
    get_all_users
)
from .middleware import roles_required, admin_required

auth_bp = Blueprint('auth', __name__)

# Public routes
auth_bp.route('/register', methods=['POST'])(register)
auth_bp.route('/login', methods=['POST'])(login)

# Protected routes
auth_bp.route('/logout', methods=['POST'])(jwt_required()(logout))
auth_bp.route('/refresh', methods=['POST'])(jwt_required(refresh=True)(refresh))
auth_bp.route('/users', methods=['GET'])(jwt_required()(admin_required(get_all_users)))

# Role-specific routes examples
@auth_bp.route('/admin', methods=['GET'])
@jwt_required()
@admin_required
def admin_route():
    return {"message": "Admin access granted"}, 200

@auth_bp.route('/manager', methods=['GET'])
@jwt_required()
@roles_required('manager', 'admin')
def manager_route():
    return {"message": "Manager access granted"}, 200