# Base image
FROM python:3.9-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file cần thiết
COPY requirements.txt .
COPY app.py .
COPY local_model_path ./local_model_path/

# Cài đặt dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose cổng
EXPOSE 5000

# Lệnh khởi chạy
CMD ["python", "app.py"]