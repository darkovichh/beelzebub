import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  try {
    const post = await Post.findById(id).populate(
      "user",
      "username profilePhoto"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(200).json({
      _id: post._id,
      title: post.title,
      description: post.description,
      views: post.views,
      username: post.user?.username || "Unknown",
      profilePhoto:
        post.user?.profilePhoto || "/default-avatar.png",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}