from flask import Blueprint, request, jsonify, render_template, redirect, url_for, session
from api.ai_models.ai_model import predict , summarize_text, review_code
from api.models.user import ChatHistory, ChatMessage
from api.settings import db, socketio
import markdown
from api.ai_models.calculate_embedding import load_model, get_query_embedding
from api.ai_models.search_utils import find_best_category, find_top_papers
from sqlalchemy import text
import numpy as np



api_bp = Blueprint("api_ai_models", __name__)  


@api_bp.route("/predict", methods=["POST"])
def predict_web():
    data = request.get_json()  
    input_data = data.get("input_data", "")  
    print(f"Input data received: {input_data}")

    # message_id = data.get("message_id")  # Lấy message_id từ frontend
    bot_response = predict(input_data) 

    
    history_chat_id = request.cookies.get("history_chat_id")

    new_message = ChatMessage(history_chat_id=history_chat_id,user_message=input_data, bot_response=bot_response)
    db.session.add(new_message)
    db.session.commit()

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
        summary = summarize_text(input_data)
        chat_history.name_conversation = summary
        chat_history.is_first_message = False 
        db.session.commit()


    new_message = ChatMessage(history_chat_id=message_id, user_message=input_data, bot_response=bot_response)
    db.session.add(new_message)
    db.session.commit()
    
    socketio.emit('update_history')        

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
    name_conversation = f"Cuộc hội thoại với ChatBOT"

    new_chat_history.name_conversation = name_conversation

    db.session.commit()

    return redirect(url_for('chat', chat_history_id=chat_history_id))




@api_bp.route("/review-code", methods=["POST"])
def review_code_route():
    code = request.form.get("code", "")
    if not code:
        return render_template("index.html", name="review.html", review_result="Vui lòng nhập code để review.", code_input=code, language="unknown")

    language = "unknown"
    file_input = request.files.get("fileInput")
    if file_input and file_input.filename:
        filename = file_input.filename.lower()
        if filename.endswith(".py"):
            language = "Python"
        elif filename.endswith(".js"):
            language = "JavaScript"
        elif filename.endswith(".java"):
            language = "Java"
        elif filename.endswith(".css"):
            language = "CSS"
        elif filename.endswith(".html"):
            language = "HTML"
    else:
        code_lower = code.lower()
        if "def " in code_lower or "import " in code_lower:
            language = "Python"
        elif "function " in code_lower or "const " in code_lower:
            language = "JavaScript"
        elif "public class " in code_lower:
            language = "Java"
        elif "{" in code_lower and "}" in code_lower and "style" in code_lower:
            language = "CSS"
        elif "<html" in code_lower or "<div" in code_lower:
            language = "HTML"

    review_result = review_code(code, language=language)
    print(review_result)
    return render_template("index.html", name="review.html", review_result=review_result, code_input=code, language=language)

@api_bp.route("/search/arxiv", methods=["POST"])
def search_arxiv():
    query = request.form.get("query")  # Lấy từ form request

    if not query:
        return jsonify({"message": "No query provided!"}), 400

    # Tạo embedding từ câu truy vấn sử dụng model đã được load
    query_embedding = get_query_embedding(query)

    # Tìm category có liên quan nhất
    best_category = find_best_category(query_embedding)

    if not best_category:
        return jsonify({"message": "No relevant category found!"}), 404

    # Lấy top các bài báo từ category tốt nhất
    top_papers = find_top_papers(query_embedding, best_category)

    # Chuẩn bị dữ liệu kết quả trả về
    results = [{"title": paper.title, "link": paper.link, "abstract": paper.abstract} for paper in top_papers]

    return jsonify({"category": best_category, "papers": results})



@api_bp.route("/search/stackoverflow", methods=["POST"])
def search_stackoverflow():
    query = request.form.get('query', '').strip()
    if not query:
        return jsonify({"message": "No query provided!"}), 400

    # Sinh embedding cho query dưới dạng Python list
    query_emb = get_query_embedding(query)
    if isinstance(query_emb, np.ndarray):
        query_emb = query_emb.tolist()

    # Dùng text() với ép kiểu ::vector
    stmt = text("""
        SELECT
          question_title   AS title,
          question_date    AS date,
          answer_1         AS answer_1,
          answer_1_score   AS answer_1_score,
          answer_2         AS answer_2,
          answer_2_score   AS answer_2_score,
          answer_3         AS answer_3,
          answer_3_score   AS answer_3_score
        FROM stackoverflow_question
        -- Ép kiểu tham số emb thành vector
        ORDER BY vector_embedding <-> (:emb)::vector
        LIMIT 20
    """)
    # Thực thi
    rows = db.session.execute(stmt, {"emb": query_emb}).fetchall()

    papers = [{
        "title":           r.title,
        "date":            r.date,
        "answer_1":        r.answer_1,
        "answer_1_score":  r.answer_1_score,
        "answer_2":        r.answer_2,
        "answer_2_score":  r.answer_2_score,
        "answer_3":        r.answer_3,
        "answer_3_score":  r.answer_3_score,
    } for r in rows]

    return jsonify({"papers": papers})