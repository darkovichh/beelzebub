import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

export default async function handler(req, res) {
  const { id } = req.query;

  await dbConnect();

  if (req.method === "GET") {
    try {
      const post = await Post.findById(id).populate(
        "user",
        "username profilePhoto"
      );

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      return res.status(200).json(post);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch post" });
    }
  }

  // 🔥 VIEW ONLY HERE (no double increment anymore)
  if (req.method === "PATCH") {
    try {
      await Post.findByIdAndUpdate(id, {
        $inc: { views: 1 },
      });

      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: "Failed to update views" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}