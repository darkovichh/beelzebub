import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  role: { type: String, default: "member" },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  biography: { type: String, default: "" },
  profilePhoto: { type: String, default: "/default-avatar.png" },
  banner: { type: String, default: "/default-banner.png" },
  loginDates: [{ type: Date }],
  posts: [{ type: Object }],
  messages: [{ type: Object }],
  comments: [{ type: Object }],
  registerDate: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);