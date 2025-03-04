# Sử dụng Node.js chính thức
FROM node:18-alpine 

# Đặt thư mục làm việc trong container
WORKDIR /app 

# Copy file package.json và package-lock.json trước để tối ưu cache
COPY package*.json ./ 

# Cài đặt dependencies
RUN npm install 

# Copy toàn bộ project vào container, ngoại trừ những file trong `.dockerignore`
COPY . .

# Build Next.js
RUN npm run build 

# Expose cổng 3000
EXPOSE 3000 

# Chạy ứng dụng
CMD ["npm", "run", "dev"]
