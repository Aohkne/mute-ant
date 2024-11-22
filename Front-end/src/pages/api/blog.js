import { connectToDatabase } from "../../lib/mongodb";

const handler = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const data = await db.collection("blog").find({}).toArray();
    res.status(200).json(data); // Trả về dữ liệu
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch data" }); // Trả về lỗi nếu kết nối không thành công
  }
};

export default handler;
