from flask import Flask, request, jsonify, Blueprint
from api.models.user import User, PendingUser
from api.settings import db, bcrypt, create_access_token
from flask import request, url_for, jsonify
from api.settings import db, mail
from flask_mail import Message


app = Blueprint("api_auth", __name__)


@app.route("/request-verification", methods=["POST"])
def request_verification():
    data = request.json
    email = data.get("email")

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email is already registered"}), 400

    if PendingUser.query.filter_by(email=email).first():
        return jsonify({"message": "Verification email already sent"}), 400

    new_pending_user = PendingUser(email=email)
    db.session.add(new_pending_user)
    db.session.commit()

    send_verification_email(new_pending_user)
    return jsonify({"message": "Verification email sent. Please check your inbox."}), 200


def send_verification_email(pending_user):
    token = pending_user.get_verification_token()
    confirm_url = url_for("verify_email", token=token, _external=True)
    msg = Message("Confirm Your Email", recipients=[pending_user.email])
    msg.body = f"Click the link to verify your email and set up your account: {confirm_url}"
    mail.send(msg)


@app.route("/verify-email/<token>", methods=["POST"])
def verify_email(token):
    email = PendingUser.verify_token(token)
    if email is None:
        return jsonify({"message": "Invalid or expired token"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 400

    data = request.json
    username = data.get("username")
    password = data.get("password")
    image_face = data.get("imageFace")

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already taken"}), 400

    new_user = User(email=email, username=username, password=bcrypt(password), image_face=image_face)
    db.session.add(new_user)
    db.session.commit()

    PendingUser.query.filter_by(email=email).delete()  # Remove from pending users
    db.session.commit()

    return jsonify({"message": "Email verified. Account created successfully!"}), 201


@app.route("/signin", methods=["POST"])
def signin():
    data = request.json
    if not data or not all(k in data for k in ("email", "password")):
        return jsonify({"message": "Missing fields"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if user and bcrypt.check_password_hash(user.password_hash, data["password"]):
        access_token = create_access_token(identity=user.id)
        return jsonify({"access_token": access_token}), 200

    return jsonify({"message": "Invalid credentials"}), 401
