# auth/middleware.py
from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from .services import AuthService

auth_service = AuthService()

def roles_required(*required_roles):
    """
    Decorator for role-based access control.
    Usage: @roles_required('admin', 'manager')
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            user = auth_service.get_user_by_id(current_user_id)
            
            if not user:
                return jsonify({"error": "User not found"}), 404
                
            # Check if user has any of the required roles
            user_roles = set(user.get('roles', []))
            required_role_set = set(required_roles)
            
            if not (user_roles & required_role_set):
                return jsonify({
                    "error": "Insufficient permissions",
                    "required_roles": list(required_roles)
                }), 403
                
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def admin_required(fn):
    """
    Decorator specifically for admin access.
    Usage: @admin_required
    """
    return roles_required('admin')(fn)

def has_role(user, role):
    """
    Utility function to check if a user has a specific role.
    Usage: has_role(user, 'admin')
    """
    return role in user.get('roles', [])

# Role definitions and their hierarchies
ROLE_HIERARCHY = {
    'admin': ['admin', 'manager', 'user'],  # Admin can do everything
    'manager': ['manager', 'user'],         # Manager can do manager and user things
    'user': ['user']                        # User can only do user things
}

def has_permission(user, required_role):
    """
    Check if user has permission based on role hierarchy.
    Usage: has_permission(user, 'manager')
    """
    user_roles = user.get('roles', [])
    allowed_roles = set()
    
    for role in user_roles:
        if role in ROLE_HIERARCHY:
            allowed_roles.update(ROLE_HIERARCHY[role])
            
    return required_role in allowed_roles