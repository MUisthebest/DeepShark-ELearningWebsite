from api.settings import db, bcrypt


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    image_face = db.Column(db.String(255), nullable=True)

    def __init__(self, username, email, password, image_face):
        self.username = username
        self.email = email
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
        self.image_face = image_face
