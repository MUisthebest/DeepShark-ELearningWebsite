from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_socketio import SocketIO

socketio = SocketIO(cors_allowed_origins="*")
db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()
