from api.settings import db
from itsdangerous import URLSafeTimedSerializer
from flask import current_app


class PendingUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def get_verification_token(self):
        serializer = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
        return serializer.dumps(self.email, salt="email-confirm")

    @staticmethod
    def verify_token(token, expiration=3600):
        serializer = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
        try:
            email = serializer.loads(token, salt="email-confirm", max_age=expiration)
        except:
            return None
        return email


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    image_face = db.Column(db.String(255), nullable=True)  # Store image URL or encoded face data
