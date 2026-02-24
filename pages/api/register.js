// ../lib/mongodb yerine
import dbConnect from "../../lib/mongodb";
import User from "../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  const { username, email, password, biography, profilePhoto, banner } = req.body;

  if (!username || !email || !password) return res.status(400).json({ message: "All required fields must be filled" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const newUser = new User({
      username,
      email,
      password,
      biography: biography || "",
      profilePhoto: profilePhoto || "/default-avatar.png",
      banner: banner || "/default-banner.png",
      role: "member",
      loginDates: [],
      posts: [],
      messages: [],
      comments: [],
    });

    await newUser.save();

    return res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}