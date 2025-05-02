# Sử dụng base image nhẹ nhất
FROM alpine:latest

# Tạo thư mục chứa model
WORKDIR /app/model
COPY local_model_path/ .

# Metadata (không cần cài đặt gì thêm)
LABEL maintainer="Your Name Bang"
CMD ["echo", "Model-only container ready"]