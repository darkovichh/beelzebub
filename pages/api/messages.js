import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";

export default async function handler(req, res) {
  await dbConnect();

  const messages = await Message.find()
    .sort({ createdAt: 1 })
    .limit(100);

  res.status(200).json(messages);
}