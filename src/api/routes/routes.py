from flask import Blueprint, request, jsonify, render_template, redirect, url_for, session
from api.ai_models.ai_model import predict , summarize_text
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
    bot_response = predict(input_data) 

    # new_chat = ChatHistory(user_message=input_data, bot_response=bot_response)
    # db.session.add(new_chat)
    # db.session.commit()
    history_chat_id = request.cookies.get("history_chat_id")
    new_message = ChatMessage(history_chat_id=history_chat_id,user_message=input_data, bot_response=bot_response)
    db.session.add(new_message)
    db.session.commit()

    bot_response = to_markdown(bot_response)
    return jsonify({"prediction": bot_response})





@api_bp.route("/handle_message", methods=["POST"])
def handle_message():
    data = request.get_json()
    input_data = data.get("input_data", "")
    message_id = data.get("message_id")
    
    bot_response = predict(input_data)

    chat_history = ChatHistory.query.get(message_id)
    is_first_message = chat_history.is_first_message

    if is_first_message:
        # Nếu là tin nhắn đầu tiên, thực hiện tóm tắt
        summary = summarize_text(message_id)

        # Cập nhật name_conversation trong cơ sở dữ liệu với tóm tắt
        chat_history.name_conversation = summary
        chat_history.is_first_message = False  # Đánh dấu là không còn là tin nhắn đầu tiên
        db.session.commit()

    new_message = ChatMessage(history_chat_id=message_id, user_message=input_data, bot_response=bot_response)
    db.session.add(new_message)
    db.session.commit()

    return jsonify({
        "prediction": bot_response
    })





@api_bp.route("/new_chat", methods=["POST"])
def new_chat():
    user_id = request.cookies.get("user_id")
    if not user_id:
        return redirect("/signin")  

    new_chat_history = ChatHistory(user_id=user_id)
    
    db.session.add(new_chat_history)
    db.session.commit()

    chat_history_id = new_chat_history.id
    name_conversation = f"Cuộc hội thoại {chat_history_id} với ChatBOT"

    new_chat_history.name_conversation = name_conversation

    db.session.commit()

    return redirect(url_for('chat', chat_history_id=chat_history_id))