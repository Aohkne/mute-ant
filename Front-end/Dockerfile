# Dùng image nhỏ gọn
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json trước để tối ưu cache layer
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Thiết lập biến môi trường build-time (Next.js chỉ nhận trong quá trình build)
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

# Expose cổng 3000
EXPOSE 3000

# Khởi chạy ứng dụng
CMD ["npm", "run", "dev"]
