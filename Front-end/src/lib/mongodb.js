import { MongoClient } from "mongodb";

// Kết nối MongoDB
const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let cachedDb = null;

export const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb; // Trả về database đã kết nối sẵn
  }

  const db = await client.connect();
  cachedDb = db.db(); // Caching database instance
  return cachedDb;
};
