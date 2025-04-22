from flask import Flask, render_template, request, redirect, url_for, session, jsonify 
from api.routes.routes import api_bp
from api.ai_models.ai_model import summarize_text
from api.settings import db, bcrypt, jwt, socketio
from flask_migrate import Migrate
from googletrans import Translator
import os
import json
import asyncio
from flask import make_response
from itertools import groupby
import base64
from bs4 import BeautifulSoup

from api.routes.auth import app as auth_bp
from flask import Flask
from api.models.user import User, ChatHistory, ChatMessage
from api.routes.auth import app as auth_bp
from googletrans import Translator

from dotenv import load_dotenv
import psycopg2

load_dotenv()


app = Flask(__name__)
translator = Translator()

# Config from .env
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)
socketio.init_app(app)
migrate = Migrate(app, db)

app.register_blueprint(api_bp, url_prefix="/api/ai_models/")
app.register_blueprint(auth_bp, url_prefix="/api/auth/")

# def get_translated_content():
#     try:
#         conn = psycopg2.connect(host="ml-web.postgres.database.azure.com", database="main_db", user="ml_admin", password="ml#web_db#2224")
#         cursor = conn.cursor()

#         cursor.execute("SELECT answer_1 FROM question WHERE question_id = 50322054")
#         row = cursor.fetchone()
#         if row:
#             answer_1 = row[0]
#         else:
#             return "Không có dữ liệu cho question_id = 50374628"


#         translated_content = translator.translate(answer_1, src='en', dest='vi').text
#         print("Dữ liệu dịch:", translated_content)

#         conn.close()
#         return translated_content

#     except Exception as e:
#         print("Lỗi kết nối DB:", e)
#         return "Không thể lấy dữ liệu"


@app.route("/")
def home():
    user_id = request.cookies.get("user_id")
    if not user_id:
        # translated_html = get_translated_content()

        # return render_template("index.html", name="home.html", user=None, content=translated_html)
        return render_template("index.html", name="home.html", user=None)

    # translated_html = get_translated_content()
    user = User.query.get(user_id) if user_id else None

    # print("Dữ liệu HTML đã dịch:", translated_html)
    # return render_template("index.html", name="home.html", user=user, content=translated_html)
    return render_template("index.html", name="home.html", user=user)


@app.route("/signin", methods=["GET"])
def signin():
    error = request.args.get("error") == "true"
    return render_template("index.html", name="login.html", error=error)


@app.route("/signup", methods=["GET"])
def signup():
    success = request.args.get("success") == "true"
    error = request.args.get("error")
    return render_template("index.html", name="sign-up.html", success=success, error=error)


@app.route("/question", methods=["GET"])
def question():
    return render_template("index.html", name="question.html")


def get_db_course():
    conn = psycopg2.connect(host="ml-web.postgres.database.azure.com", database="main_db", user="ml_admin", password="ml#web_db#2224")
    return conn


@app.route("/profile", methods=["GET"])
def profile():
    user_id = request.cookies.get("user_id")
    user = User.query.get(user_id)
    if not user:
        return redirect("/")

    return render_template("index.html", name="profile.html", user=user)

@app.route("/chat-history", methods=["GET"])
def chat_history():
    user_id = request.cookies.get("user_id")
    if not user_id:
        return jsonify([])
    
    all_chats = ChatHistory.query.filter_by(user_id=user_id).order_by(ChatHistory.id.desc()).all()
    
    result = []
    for chat in all_chats:
        latest_message = ChatMessage.query.filter_by(history_chat_id=chat.id)\
                                         .order_by(ChatMessage.created_at.desc())\
                                         .first()
        if latest_message:
            summary = summarize_text(latest_message.bot_response)[:255] 
            chat.name_conversation = summary
            db.session.commit()
        
        result.append({
            "id": chat.id,
            "name": chat.name_conversation
        })
    
    return jsonify(result)


@app.route("/change-avatar", methods=["POST"])
def change_avatar():
    file = request.files["avatar"]
    user_id = request.cookies.get("user_id")
    user = User.query.get(user_id)

    if file and user:
        encoded = base64.b64encode(file.read()).decode("utf-8")
        user.image_face = encoded
        user.avatar_mime = file.mimetype
        db.session.commit()

    return redirect("/profile")


@app.route("/chat", methods=["GET"], endpoint="chat")
def chat():

    user_id = request.cookies.get("user_id")
    if not user_id:
        return redirect("/signin")

    user = User.query.get(user_id) if user_id else None

    chat_history_id = request.cookies.get("history_chat_id")
    if not chat_history_id:
        chat_history_id = request.args.get("chat_history_id")
        if ChatHistory.created_at:
            last_chat = ChatHistory.query.filter_by(user_id=user_id).order_by(ChatHistory.created_at.desc()).first()
            if last_chat:
                chat_history_id = last_chat.id

    all_chats = ChatHistory.query.filter_by(user_id=user_id).order_by(ChatHistory.id.desc()).all()

    if chat_history_id:
        messages = ChatMessage.query.filter_by(history_chat_id=chat_history_id).all()
        chat_messages = [message.to_dict() for message in messages]
    else:
        chat_messages = []
    return render_template("index.html", name="chat.html", user=user, chats=all_chats, chat_messages=chat_messages, message_id=chat_history_id)


async def translate_html_content(html_content):
    soup = BeautifulSoup(html_content, "html.parser")

    for a_tag in soup.find_all("a"):
        a_tag["data-no-ajax"] = ""

    skip_tags = {"pre", "td", "th", "a", "script", "style", "code", "h1"}
    skip_classes = {"t-spar", "t-sdsc-begin", "co2"}
    elements = []
    text_to_translate = ""
    for element in soup.find_all(text=True):
        parent = element.parent
        if parent.name in skip_tags or any(cls in skip_classes for cls in parent.get("class", [])):
            continue

        text = element.strip()
        if text:
            elements.append(element)
            text_to_translate += text + "\n\n"

    async with Translator() as translator:
        translated_text = await translator.translate(text_to_translate, dest="vi")
        translated_text = translated_text.text
        text_components = translated_text.split("\n\n")
        for element, text in zip(elements, text_components):
            element.replace_with(text)

    return str(soup)


class LLMS(db.Model):
    __tablename__ = "llms"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    url = db.Column(db.String, nullable=False)
    icon = db.Column(db.String, nullable=False)
    group = db.Column(db.Integer, nullable=False)


@app.route("/llms", methods=["GET"])
def llms():
    llms_data = LLMS.query.order_by(LLMS.group).all()
    grouped_data = {}
    for row in llms_data:
        if row.group not in grouped_data:
            grouped_data[row.group] = []
        grouped_data[row.group].append(row)
    group_label = ["Academic Courses", "Open Source Models", "Research Papers", "Video Tutorials", "Data Processing Tools", "Datasets", "Free Resources", "GitHub Repositories", "LLM Communities", "LLM Deployment", "LLM Leaderboards", "Open Source Apps / Projects"]

    return render_template("index.html", name="llms.html", grouped_data=grouped_data, group_label=group_label)


@app.route("/question", methods=["GET"])
@app.route("/tutorial/<path:subpath>", methods=["GET"])
@app.route("/tutorial", methods=["GET"])
async def tutorial(subpath=None):
    current_dir = os.path.dirname(os.path.abspath(__file__))

    json_files = {"cpp": os.path.join(current_dir, "templates/crawlers/cpp/index.json"), "python": os.path.join(current_dir, "templates/crawlers/python/index.json"), "django": os.path.join(current_dir, "templates/crawlers/django/index.json"), "flask": os.path.join(current_dir, "templates/crawlers/flask/index.json"), "numpy": os.path.join(current_dir, "templates/crawlers/numpy/index.json")}

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
                        tree_structure[entry_type].append({"name": entry["name"], "path": entry["path"]})

                return tree_structure
        except FileNotFoundError:
            return None

    cpp_data = read_json(json_files["cpp"])
    python_data = read_json(json_files["python"])
    django_data = read_json(json_files["django"])
    flask_data = read_json(json_files["flask"])
    numpy_data = read_json(json_files["numpy"])

    translated_content = "Nội dung không tìm thấy."

    if subpath:
        if subpath in cpp_data:
            translated_content = "<h2>Danh sách bài học trong C++ - {}</h2>".format(subpath)
            translated_content += "<ul>"
            for item in cpp_data[subpath]:
                translated_content += f'<li><a href="/tutorial/cpp/{item["path"]}" data-no-ajax>{item["name"]}</a></li>'
            translated_content += "</ul>"

        elif subpath in python_data:
            translated_content = "<h2>Danh sách bài học trong Python - {}</h2>".format(subpath)
            translated_content += "<ul>"
            for item in python_data[subpath]:
                translated_content += f'<li><a href="/tutorial/python/{item["path"]}" data-no-ajax>{item["name"]}</a></li>'
            translated_content += "</ul>"

        elif subpath in django_data:
            translated_content = "<h2>Danh sách bài học trong Django - {}</h2>".format(subpath)
            translated_content += "<ul>"
            for item in django_data[subpath]:
                translated_content += f'<li><a href="/tutorial/django/{item["path"]}" data-no-ajax>{item["name"]}</a></li>'
            translated_content += "</ul>"

        elif subpath in flask_data:
            translated_content = "<h2>Danh sách bài học trong Flask - {}</h2>".format(subpath)
            translated_content += "<ul>"
            for item in flask_data[subpath]:
                translated_content += f'<li><a href="/tutorial/flask/{item["path"]}" data-no-ajax>{item["name"]}</a></li>'
            translated_content += "</ul>"

        elif subpath in numpy_data:
            translated_content = "<h2>Danh sách bài học trong NumPy - {}</h2>".format(subpath)
            translated_content += "<ul>"
            for item in numpy_data[subpath]:
                translated_content += f'<li><a href="/tutorial/numpy/{item["path"]}" data-no-ajax>{item["name"]}</a></li>'
            translated_content += "</ul>"

        else:
            # Nếu không trùng type, kiểm tra file HTML
            read_file = os.path.join(current_dir, "templates/crawlers", subpath + ".html")
            if os.path.exists(read_file):
                with open(read_file, "r", encoding="utf-8") as html_file:
                    html_content = html_file.read()
                translated_content = await translate_html_content(html_content)

    response = make_response(render_template("index.html", name="tutorial.html", cpp=cpp_data, python=python_data, django=django_data, flask=flask_data, numpy=numpy_data, content=translated_content))

    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


@app.route("/review", methods=["GET"])
def review():
    return render_template("index.html", name="review.html")

