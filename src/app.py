from flask import Flask, render_template
from api.routes.routes import api_bp
from api.settings import db, bcrypt, jwt
import os

from api.routes.auth import app as auth_bp
from flask import Flask


from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Config from .env
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

app.register_blueprint(api_bp, url_prefix="/api/ai_models/")
app.register_blueprint(auth_bp, url_prefix="/api/auth/")


@app.route("/")
def home():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
