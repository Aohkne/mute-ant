//src/lib/mongodb.js
import { MongoClient } from "mongodb";

// Kết nối MongoDB
const client = new MongoClient(process.env.MONGODB_URI);

let cachedDb = null;

export const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb; // Trả về database đã kết nối sẵn
  }

  try {
    const db = await client.connect();
    cachedDb = db.db(); // Lưu trữ database instance
    return cachedDb;
  } catch (error) {
    console.error("Kết nối MongoDB thất bại:", error);
    throw new Error("Không thể kết nối đến MongoDB");
  }
};
