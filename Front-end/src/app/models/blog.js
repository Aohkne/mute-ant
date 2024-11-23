import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  img: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
  content: { type: String, required: true },
  source: { type: String, required: true },
});

// Kiểm tra model Blog có tồn tại trước khi tạo mới
export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
