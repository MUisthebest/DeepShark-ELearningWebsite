from flask import Flask, request, jsonify, Blueprint
from api.models.user import User
from api.settings import db, bcrypt, create_access_token
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Blueprint("api_auth", __name__)


@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    if not data or not all(k in data for k in ("username", "email", "password")):
        return jsonify({"message": "Missing fields"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already exists"}), 409

    new_user = User(data["username"], data["email"], data["password"], data.get("image_face"))

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201


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


@app.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"id": user.id, "username": user.username, "email": user.email, "image_face": user.image_face}), 200
