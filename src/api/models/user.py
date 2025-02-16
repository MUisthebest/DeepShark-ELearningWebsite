from api.settings import db, bcrypt


class ChatHistory(db.Model):
    __tablename__ = 'history_chat' 

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    chat_messages = db.relationship('ChatMessage', backref='history_chat', lazy=True)

    def __init__(self, user_id, chat_messages):
        self.user_id = user_id
        self.chat_messages = chat_messages



class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    image_face = db.Column(db.String(255), nullable=True)


    history_chats = db.relationship('HistoryChat', backref='user', lazy=True)

    def __init__(self, username, email, password, image_face):
        self.username = username
        self.email = email
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
        self.image_face = image_face
