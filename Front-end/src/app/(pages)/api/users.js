import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Kết nối MongoDB
    const client = new MongoClient(
      process.env.MONGODB_URI || "mongodb://localhost:27017"
    );
    await client.connect();

    // Truy cập database và collection
    const db = client.db("mute-ant");
    const collection = db.collection("user_account");

    // Lấy tất cả users
    const users = await collection.find({}).toArray();

    // Đóng kết nối
    await client.close();

    // Trả về dữ liệu
    res.status(200).json(users);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: error.message });
  }
}
