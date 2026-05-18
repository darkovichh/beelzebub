import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      userId,
      username,
      bio,
      profilePhoto,
      banner,
      password,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ================= UPDATE FIELDS =================
    if (username !== undefined) user.username = username;

    if (bio !== undefined) user.bio = bio;

    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;

    // 🔥 CRITICAL FIX (banner save)
    if (banner !== undefined) user.banner = banner;

    if (password && password.trim() !== "") {
      user.password = password;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}