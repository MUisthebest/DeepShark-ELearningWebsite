from flask import Flask, render_template, request, redirect, url_for
from api.routes.routes import api_bp
from api.settings import db, bcrypt, jwt
from flask_migrate import Migrate
import os

from api.routes.auth import app as auth_bp
from flask import Flask
from api.models.user import User, ChatHistory
from api.routes.auth import app as auth_bp 

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
        return render_template("index.html", name="home.html", user=None, chats=[])

    user = User.query.get(user_id) if user_id else None
    chats = ChatHistory.query.all() 
    return render_template("index.html", name="home.html", user=user, chats=chats)


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
    conn = get_db_course()
    cur = conn.cursor()
    cur.execute("SELECT name, link, image FROM courses")
    courses = cur.fetchall()
    cur.close()
    return render_template("index.html", name="tutorial.html", courses=courses)

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


if __name__ == "__main__":
    app.run(debug=True)
