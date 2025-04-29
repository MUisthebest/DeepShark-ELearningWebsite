from flask import Flask, request, jsonify, Blueprint, make_response, redirect, url_for, session, render_template
from api.models.user import User
from api.settings import db, bcrypt, create_access_token
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Blueprint("api_auth", __name__)


@app.route("/signup", methods=["POST"])
def signup():
    data = request.form
    if User.query.filter_by(email=data["email"]).first():
        return redirect("/signup?error=Email already exists!")
    if User.query.filter_by(username=data["username"]).first():
        return redirect("/signup?error=Username already exists!")

    new_user = User(data["username"], data["email"], data["password"], data.get("image_face"))

    db.session.add(new_user)
    db.session.commit()

    return redirect("/signup?success=true")


@app.route("/signin", methods=["POST"])
def signin():
    data = request.form

    user = User.query.filter_by(email=data["email"]).first()
    if user and bcrypt.check_password_hash(user.password_hash, data["password"]):
        response = make_response(redirect(url_for("home")))
        response.set_cookie("user_id", str(user.id), httponly=True, max_age=86400)
        return response

    return redirect("/signin?error=true")


@app.route("/logout", methods=["GET"])
def logout():
    response = make_response(redirect("/"))
    response.delete_cookie("user_id")
    return response
