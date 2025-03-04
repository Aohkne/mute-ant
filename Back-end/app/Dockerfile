# Sử dụng image Python chính thức làm base
FROM python:3.10-slim

# Cài đặt các dependencies hệ thống cần thiết cho OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép file requirements.txt trước để tận dụng cache của Docker
COPY requirements.txt .

# Cài đặt các dependencies Python
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng mà ứng dụng sẽ chạy
EXPOSE 5000

# Câu lệnh để chạy ứng dụng
CMD ["python", "app.py"]