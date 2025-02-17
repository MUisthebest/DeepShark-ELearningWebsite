from api.settings import db, bcrypt




class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    image_face = db.Column(db.String(255), nullable=True)

    history_chats = db.relationship('ChatHistory', backref='user', lazy=True)
    def __init__(self, username, email, password, image_face):
        self.username = username
        self.email = email
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
        self.image_face = image_face


class ChatHistory(db.Model):
    __tablename__ = 'chat_history' 

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name_conversation = db.Column(db.String(), nullable=False)
    chat_messages = db.relationship('ChatMessage', backref='chat_history', lazy=True)
    

    def __init__(self, user_id):
        self.user_id = user_id


class ChatMessage(db.Model):
    __tablename__ = 'chat_message' 

    id = db.Column(db.Integer, primary_key=True)
    history_chat_id = db.Column(db.Integer, db.ForeignKey('chat_history.id'), nullable=False)
    user_message = db.Column(db.Text, nullable=False)
    bot_response = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __init__(self, history_chat_id, user_message, bot_response):
        self.history_chat_id = history_chat_id
        self.user_message = user_message
        self.bot_response = bot_response

    def to_dict(self):
        return{
            'user_message': self.user_message,
            'bot_response': self.bot_response,
        }