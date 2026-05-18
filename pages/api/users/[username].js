import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username } = req.query;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      _id: user._id,
      username: user.username,

      bio: user.bio || "",
      rating: user.rating || 0,
      views: user.views || 0,
      comments: user.comments || 0,

      profilePhoto: user.profilePhoto || "/default-avatar.png",

      // 🔥 FIX: fallback chain
      banner: user.banner || "/default-banner.png",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}