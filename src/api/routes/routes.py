from flask import Blueprint, request, jsonify, render_template, redirect, url_for
from api.ai_models.ai_model import predict  
from api.models.user import ChatHistory, ChatMessage 
from api.settings import db
import markdown



api_bp = Blueprint("api_ai_models", __name__)  # Khởi tạo Blueprint

def to_markdown(text):
    return markdown.markdown(text)


@api_bp.route("/predict", methods=["POST"])
def predict_web():
    data = request.get_json()  
    input_data = data.get("input_data", "")  
    print(f"Input data received: {input_data}")

    message_id = data.get("message_id")  # Lấy message_id từ frontend
    print(f"Message ID: {message_id}")

    bot_response = predict(input_data) 

    # new_chat = ChatHistory(user_message=input_data, bot_response=bot_response)
    # db.session.add(new_chat)
    # db.session.commit()


    new_message = ChatMessage(history_chat_id=2,user_message=input_data, bot_response=bot_response)
    db.session.add(new_message)
    db.session.commit()

    
    bot_response = to_markdown(bot_response)
    return jsonify({"prediction": bot_response})


@api_bp.route("/new_chat", methods=["POST"])
def new_chat():
    user_id = request.cookies.get("user_id")
    if not user_id:
        return redirect("/signin")  
    name_conversation = f"Cuộc hội thoại mới với ChatBOT trí tuệ nhân tạo"

    new_chat_history = ChatHistory(user_id=user_id, name_conversation=name_conversation)
    db.session.add(new_chat_history)
    db.session.commit()

    
    # Lấy ID của cuộc hội thoại mới
    chat_history_id = new_chat_history.id

    return redirect(url_for('api_ai_models.chat', chat_history_id=chat_history_id))  # Điều hướng đến trang chat



