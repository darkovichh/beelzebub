import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const post = await Post.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      ).populate("user", "username profilePhoto");

      if (!post) return res.status(404).json({ error: "Post not found" });

      return res.status(200).json(post);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch post" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}