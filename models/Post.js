import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: String,
  description: String,
  category: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },

  views: {
    type: Number,
    default: 0,
  },

  // 🔥 FIX: comment counter
  commentCount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.Post ||
  mongoose.model("Post", PostSchema);