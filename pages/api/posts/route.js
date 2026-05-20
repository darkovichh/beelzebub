import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET() {
  try {
    console.log("STEP 1: API HIT");

    await dbConnect();
    console.log("STEP 2: DB CONNECTED");

    const posts = await Post.find({}).sort({ createdAt: -1 });

    console.log("STEP 3: POSTS FETCHED");

    return Response.json(posts);
  } catch (error) {
    console.error("❌ FULL ERROR:", error);

    return Response.json(
      {
        error: "Server crash",
        message: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}