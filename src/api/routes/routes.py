from flask import Blueprint, request, jsonify, render_template
from api.ai_models.ai_model import predict  # Đảm bảo import đúng
from api.models.user import ChatHistory  # Import model ChatHistory
from api.settings import db



api_bp = Blueprint("api_ai_models", __name__)  # Khởi tạo Blueprint


@api_bp.route("/predict", methods=["POST"])
def predict_web():
    data = request.get_json()  
    input_data = data.get("input_data", "")  
    print(f"Input data received: {input_data}")
    bot_response = predict(input_data) 

    new_chat = ChatHistory(user_message=input_data, bot_response=bot_response)
    db.session.add(new_chat)
    db.session.commit()

    return jsonify({"prediction": bot_response})