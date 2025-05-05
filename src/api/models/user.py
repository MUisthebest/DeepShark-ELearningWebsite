from api.settings import db, bcrypt
from pgvector.sqlalchemy import Vector  
from sqlalchemy.dialects.postgresql import ARRAY, DOUBLE_PRECISION
import os
import json
from flask import current_app


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    image_face = db.Column(db.Text, nullable=True)
    avatar_mime = db.Column(db.String(50))

    history_chats = db.relationship("ChatHistory", backref="user", lazy=True)

    def __init__(self, username, email, password, image_face):
        self.username = username
        self.email = email
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
        self.image_face = image_face


class ChatHistory(db.Model):
    __tablename__ = "chat_history"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    name_conversation = db.Column(db.String(), nullable=False, default="Cuộc hội thoại mới")
    is_first_message = db.Column(db.Boolean, default=True)
    chat_messages = db.relationship("ChatMessage", backref="chat_history", lazy=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __init__(self, user_id):
        self.user_id = user_id
        self.is_first_message = True


class ChatMessage(db.Model):
    __tablename__ = "chat_message"

    id = db.Column(db.Integer, primary_key=True)
    history_chat_id = db.Column(db.Integer, db.ForeignKey("chat_history.id"), nullable=False)
    user_message = db.Column(db.Text, nullable=False)
    bot_response = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __init__(self, history_chat_id, user_message, bot_response):
        self.history_chat_id = history_chat_id
        self.user_message = user_message
        self.bot_response = bot_response

    def to_dict(self):
        return {
            "user_message": self.user_message,
            "bot_response": self.bot_response,
        }


class StackOverflowQuestion(db.Model):
    __tablename__ = 'question'

    question_id = db.Column(db.Integer, primary_key=True)  
    question_title = db.Column(db.Text(), nullable=False)
    question_date = db.Column(db.Date, nullable=False)
    answer_1 = db.Column(db.Text(), nullable=False)
    answer_1_score = db.Column(db.Integer, nullable=False)
    answer_2 = db.Column(db.Text(), nullable=False)
    answer_2_score = db.Column(db.Integer, nullable=False)
    answer_3 = db.Column(db.Text(), nullable=False)
    answer_3_score = db.Column(db.Integer, nullable=False)
    
    # Cột vector_embedding sử dụng kiểu pgvector

    def __init__(self, question_title, question_date, answer_1, answer_1_score, 
                 answer_2, answer_2_score, answer_3, answer_3_score,
                 vector_embedding):
        self.question_title = question_title
        self.question_date = question_date
        self.answer_1 = answer_1
        self.answer_1_score = answer_1_score
        self.answer_2 = answer_2
        self.answer_2_score = answer_2_score
        self.answer_3 = answer_3
        self.answer_3_score = answer_3_score
        self.vector_embedding = vector_embedding

    def __repr__(self):
        return f"<StackOverflowQuestion {self.question_title}>"


class ArxivPaper(db.Model):
    __tablename__ = 'arxiv_papers'

    id = db.Column(db.Integer, primary_key=True) 
    title = db.Column(db.Text(), nullable=False)  
    question = db.Column(db.Text(), nullable=False) 
    link = db.Column(db.Text(), nullable=False)  
    category = db.Column(db.String(255), nullable=False) 
    abstract = db.Column(db.Text(), nullable=False)  
    vector_embedding = db.Column(Vector(384), nullable=False) 

    def __init__(self, title, question, link, category, abstract, vector_embedding):
        self.title = title
        self.question = question
        self.link = link
        self.category = category
        self.abstract = abstract
        self.vector_embedding = vector_embedding

    def __repr__(self):
        return f"<ArxivPaper {self.title}>"


class CategoryEmbedding(db.Model):
    __tablename__ = 'category_embeddings_average'

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.Text(), nullable=False)
    avg_embedding = db.Column(ARRAY(DOUBLE_PRECISION), nullable=False)

    def __repr__(self):
        return f'<CategoryEmbedding {self.category}>'
    
    
class TutorialCache:
    cpp = {}
    python = {}
    django = {}
    flask = {}
    numpy = {}

    @classmethod
    def load(cls):
        static_dir = os.path.join(current_app.root_path, "static", "crawlers")
        json_files = {
            "cpp": os.path.join(static_dir, "cpp", "index.json"),
            "python": os.path.join(static_dir, "python", "index.json"),
            "django": os.path.join(static_dir, "django", "index.json"),
            "flask": os.path.join(static_dir, "flask", "index.json"),
            "numpy": os.path.join(static_dir, "numpy", "index.json"),
        }

        def read_json(file_path):
            try:
                with open(file_path, "r", encoding="utf-8") as file:
                    data = json.load(file)
                    entries = data.get("entries", [])
                    types = data.get("types", [])

                    if not isinstance(entries, list) or not isinstance(types, list):
                        return None

                    tree_structure = {}
                    for type_item in types:
                        type_name = type_item["name"]
                        tree_structure[type_name] = []

                    for entry in entries:
                        entry_type = entry["type"]
                        if entry_type in tree_structure:
                            tree_structure[entry_type].append({
                                "name": entry["name"],
                                "path": entry["path"]
                            })

                    return tree_structure
            except FileNotFoundError:
                return None

        cls.cpp = read_json(json_files["cpp"])
        cls.python = read_json(json_files["python"])
        cls.django = read_json(json_files["django"])
        cls.flask = read_json(json_files["flask"])
        cls.numpy = read_json(json_files["numpy"])