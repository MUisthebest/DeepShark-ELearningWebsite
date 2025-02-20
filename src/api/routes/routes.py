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
    message_id = data.get("message_id")  # Lấy message_id từ frontend
    chat_history_id = request.cookies.get("history_chat_id")

    is_first_message = session.get('is_first_message', False)

    if is_first_message: 
        summary_text = summarize_text(input_data)  

        chat_history = ChatHistory.query.get(chat_history_id)
        if chat_history:
            chat_history.name_conversation = summary_text
            chat_history.is_first_message = False  
            db.session.commit()

        bot_response = predict(input_data)

        new_message = ChatMessage(history_chat_id=chat_history_id, user_message=input_data, bot_response=bot_response)
        db.session.add(new_message)
        db.session.commit()

        bot_response = to_markdown(bot_response)
        return jsonify({"prediction": bot_response})

    else:
        bot_response = predict(input_data)

        new_message = ChatMessage(history_chat_id=chat_history_id, user_message=input_data, bot_response=bot_response)
        db.session.add(new_message)
        db.session.commit()

        bot_response = to_markdown(bot_response)
        return jsonify({"prediction": bot_response})





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