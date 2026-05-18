import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import Post from "@/models/Post";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { postId, text, userId } = req.body;

      const comment = await Comment.create({
        post: postId,
        text,
        user: userId,
      });

      const populated = await comment.populate("user");

      // 🔥 UPDATE POST COUNT
      await Post.findByIdAndUpdate(postId, {
        $inc: { commentCount: 1 },
      });

      // 🔥 REAL SOCKET BROADCAST (CRITICAL FIX)
      if (req.socket.server.io) {
        req.socket.server.io.emit("newComment", {
          postId,
          comment: populated,
        });
      }

      return res.status(201).json(populated);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "GET") {
    const { postId } = req.query;

    const comments = await Comment.find({ post: postId })
      .populate("user")
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  }

  return res.status(405).json({ error: "Method not allowed" });
}