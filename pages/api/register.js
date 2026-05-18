import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();

  try {
    const { username, email, password } = req.body;

    // 🔒 basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 🔒 username kontrol
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // 🔒 email kontrol (EKLENDİ)
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // 🔒 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created",
      username: user.username,
    });

  } catch (err) {
    console.error(err);

    // 🔥 Mongo duplicate fallback (race condition için)
    if (err.code === 11000) {
      return res.status(400).json({
        error: "Username or email already exists",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}