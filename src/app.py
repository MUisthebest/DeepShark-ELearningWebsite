from flask import Flask, render_template
from api.routes import api_bp 

app = Flask(__name__)
app.register_blueprint(api_bp, url_prefix="/api")

@app.route('/')
def home():
    return render_template('index.html', name='home.html')

@app.route("/login", methods=["GET"])
def login():
    return render_template("index.html", name='login.html')

@app.route("/sign-up", methods=["GET"])
def signUp():
    return render_template("index.html", name='sign-up.html')

if __name__ == "__main__":
    app.run(debug=True)