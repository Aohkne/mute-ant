# auth/models.py
from datetime import datetime
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash

class User:
    def __init__(self, username, email, password, full_name=None, dob=None, is_active=True, roles=None, address=None, _id=None, created_at=None):
        self._id = _id if _id else ObjectId()
        self.username = username
        self.email = email
        self.password = generate_password_hash(password) 
        self.full_name = full_name
        self.dob = dob  
        self.is_active = is_active
        self.roles = roles if roles else []  
        self.address = address if address else {} 
        self.created_at = created_at if created_at else datetime.utcnow()

    def to_dict(self):
        """Convert the User object to a dictionary."""
        return {
            "_id": str(self._id),
            "username": self.username,
            "email": self.email,
            "full_name": self.full_name,
            "dob": self.dob,
            "created_at": self.created_at.isoformat(),
            "is_active": self.is_active,
            "roles": self.roles,
            "address": self.address
        }

    @staticmethod
    def from_dict(data):
        """Create a User object from a dictionary."""
        return User(
            username=data.get('username'),
            email=data.get('email'),
            password=data.get('password'), 
            full_name=data.get('full_name'),
            dob=data.get('dob'),
            is_active=data.get('is_active', True),
            roles=data.get('roles', []),
            address=data.get('address', {}),
            _id=ObjectId(data['_id']) if '_id' in data else None,
            created_at=datetime.fromisoformat(data['created_at']) if 'created_at' in data else None
        )

    def check_password(self, password):
        """Verify the provided password against the stored hash."""
        return check_password_hash(self.password, password)
