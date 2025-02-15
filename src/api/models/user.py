from api.settings import db, bcrypt


class ChatHistory(db.Model):
    __tablename__ = 'history_chat' 

    id = db.Column(db.Integer, primary_key=True)
    user_message = db.Column(db.String(), nullable=False)  
    bot_response = db.Column(db.String(), nullable=False)  

    def __init__(self, user_message, bot_response):
        self.user_message = user_message
        self.bot_response = bot_response



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
