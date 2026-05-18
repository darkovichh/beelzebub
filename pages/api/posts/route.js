import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const filter = userId ? { user: userId } : {};

    const posts = await Post.find(filter).sort({
      createdAt: -1,
    });

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed" }),
      { status: 500 }
    );
  }
}