import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID missing" });
  }

  try {
    await dbConnect();

    if (req.method === "GET") {
      // her request = +1 view
      await Post.findByIdAndUpdate(id, { $inc: { views: 1 } });

      const post = await Post.findById(id);

      if (!post) return res.status(404).json({ error: "Not found" });

      return res.status(200).json(post);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}