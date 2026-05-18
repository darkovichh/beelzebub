import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";

export default async function handler(req, res) {
  await dbConnect();

  // ================= GET POSTS =================
  if (req.method === "GET") {
    try {
      const { userId } = req.query;

      let filter = {};

      // 🔥 HARD SAFE CHECK (undefined fix)
      if (userId && userId !== "undefined") {
        filter.user = userId;
      }

      const posts = await Post.find(filter)
        .sort({ createdAt: -1 })
        .populate("user", "username profilePhoto");

      return res.status(200).json(posts);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ================= CREATE POST =================
  if (req.method === "POST") {
    try {
      const { username, title, description, category } = req.body;

      if (!username) {
        return res.status(400).json({ error: "username missing" });
      }

      const userDoc = await User.findOne({ username });

      if (!userDoc) {
        return res.status(404).json({ error: "User not found" });
      }

      const post = await Post.create({
        user: userDoc._id,
        title,
        description,
        category,
        createdAt: new Date(),
        views: 0,
      });

      const populated = await post.populate("user", "username profilePhoto");

      return res.status(201).json(populated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}