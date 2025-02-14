from flask import Blueprint, request, jsonify, render_template
from api.ai_models.ai_model import predict  # Đảm bảo import đúng

api_bp = Blueprint("api_ai_models", __name__)  # Khởi tạo Blueprint


@api_bp.route("/predict", methods=["POST"])
def predict_web():
    data = request.form.get("input_data", "")
    print(f"Input data received: {data}")
    result = predict(data)
    return render_template("index.html", prediction=result)
