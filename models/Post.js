import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
  category: String,

  views: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Post ||
  mongoose.model("Post", PostSchema);