from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_socketio import SocketIO

SocketIO(cors_allowed_origins="*", async_mode='eventlet')
db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()
