from flask import Flask, render_template, request, redirect, url_for
from api.routes.routes import api_bp
from api.settings import db, bcrypt, jwt
from flask_migrate import Migrate
from googletrans import Translator
import os
import json
import asyncio
from flask import make_response


from bs4 import BeautifulSoup

from api.routes.auth import app as auth_bp
from flask import Flask
from api.models.user import User


from dotenv import load_dotenv
import psycopg2

load_dotenv()


app = Flask(__name__)

# Config from .env
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

migrate = Migrate(app, db)

app.register_blueprint(api_bp, url_prefix="/api/ai_models/")
app.register_blueprint(auth_bp, url_prefix="/api/auth/")


@app.route("/")
def home():
    user_id = request.cookies.get("user_id")
    if not user_id:
        return render_template("index.html", name="home.html", user=None)

    user = User.query.get(user_id) if user_id else None
    return render_template("index.html", name="home.html", user=user)


@app.route("/signin", methods=["GET"])
def signin():
    return render_template("index.html", name="login.html")


@app.route("/signup", methods=["GET"])
def signup():
    return render_template("index.html", name="sign-up.html")


@app.route("/question", methods=["GET"])
def question():
    return render_template("index.html", name="question.html")


def get_db_course():
    conn = psycopg2.connect(host="ml-web.postgres.database.azure.com", database="main_db", user="ml_admin", password="ml#web_db#2224")
    return conn


@app.route("/tutorial", methods=["GET"])
def tutorial():
    return render_template("index.html", name="tutorial.html")
    # conn = get_db_course()
    # cur = conn.cursor()
    # cur.execute("SELECT name, link, image FROM courses")
    # courses = cur.fetchall()
    # cur.close()
    # return render_template("index.html", name="tutorial.html", courses=courses)


@app.route("/profile", methods=["GET"])
def profile():
    user_id = request.cookies.get("user_id")
    user = User.query.get(user_id)
    if not user:
        return redirect("/")

    return render_template("index.html", name="profile.html", user=user)


@app.route("/chat", methods=["GET"])
def chat():
    user_id = request.cookies.get("user_id")
    if not user_id:
        return render_template("index.html", name="chat.html", user=None)

    user = User.query.get(user_id) if user_id else None
    return render_template("index.html", name="chat.html", user=user)


async def translate_html_content(html_content):
    soup = BeautifulSoup(html_content, "html.parser")

    skip_tags = {"pre", "td", "th", "code", "a", "script", "style"}
    skip_classes = {"t-spar", "t-sdsc-begin"}
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


@app.route("/tutorial/<path:subpath>", methods=["GET"])
async def viewTutorial(subpath):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_file = os.path.join(current_dir, "templates/crawlers/cpp/index.json")
    read_file = os.path.join(current_dir, "templates/crawlers/cpp", subpath + ".html")

    try:
        with open(json_file, "r", encoding="utf-8") as file:
            data = json.load(file)
            entries = data.get("entries", [])
        html_content = ""
        if os.path.exists(read_file):
            with open(read_file, "r", encoding="utf-8") as html_file:
                html_content = html_file.read()
            print("viewTuto")
            translated_content = await translate_html_content(html_content)
        else:
            translated_content = "Nội dung không tìm thấy."
            print("Not Found")

        response = make_response(render_template("index.html", name="", data=entries, content=translated_content))
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"

        return response

    except FileNotFoundError:
        return "File not found", 404


if __name__ == "__main__":
    app.run(debug=True)
