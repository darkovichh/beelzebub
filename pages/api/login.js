import dbConnect from "../../lib/mongodb";
import User from "../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  const { identifier, password } = req.body;

  if (!identifier || !password) return res.status(400).json({ message: "All fields are required" });

  try {
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });

    if (!user || user.password !== password)
      return res.status(401).json({ message: "Invalid credentials" });

    user.loginDates.push(new Date());
    await user.save();

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}