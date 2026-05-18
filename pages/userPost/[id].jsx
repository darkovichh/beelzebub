"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
import Navbar from "@/components/Navbar";

export default function UserPost() {
  const router = useRouter();
  const { id } = router.query;

  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const socketRef = useRef(null);

  const defaultPfp = "/images/default pfp.jpeg";

  // SOCKET
  useEffect(() => {
    if (!id) return;

    fetch("/api/socket");
    socketRef.current = io();

    socketRef.current.on("newComment", ({ postId, comment: newComment }) => {
      if (postId !== id) return;

      setComments((prev) => [newComment, ...prev]);

      setPostData((prev) =>
        prev
          ? { ...prev, commentCount: (prev.commentCount || 0) + 1 }
          : prev
      );
    });

    return () => socketRef.current?.disconnect();
  }, [id]);

  // FETCH
  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();
      setPostData(data);
    };

    const fetchComments = async () => {
      const res = await fetch(`/api/comments?postId=${id}`);
      const data = await res.json();
      setComments(data);
      setLoading(false);
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleComment = async () => {
    if (!comment.trim()) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return alert("Login olmalısın");

    const res = await fetch(`/api/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: id,
        text: comment,
        userId: user._id,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setComments((prev) => [data, ...prev]);
      setComment("");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!postData) return <div>Post not found</div>;

  return (
    <>
      <Navbar />

      <div className="user-post">

        {/* POST HEADER */}
        <div className="post-title">
          <div className="post-title-shadow">

            {/* 🔥 POST OWNER PFP FIX */}
            <div
              className="user-pfp"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundImage: `url(${
                  postData.user?.profilePhoto || defaultPfp
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
              }}
              onClick={() =>
                router.push(`/user/${postData.user?.username}`)
              }
            />

            <div className="user-post-desc">
              <p
                style={{ cursor: "pointer" }}
                onClick={() =>
                  router.push(`/user/${postData.user?.username}`)
                }
              >
                @{postData.user?.username || "Unknown"}
              </p>

              <h1>{postData.title}</h1>
              <p>{postData.description}</p>

              <h2>Views: {postData.views}</h2>
              <h3>
                Comments: {postData.commentCount || comments.length}
              </h3>
            </div>

          </div>
        </div>

        {/* COMMENT INPUT */}
        <div className="post-comment">

          <div
            className="comment-pfp"
            style={{
              backgroundImage: `url(${defaultPfp})`,
            }}
          />

          <div className="comment-box">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="write your comment.."
            />
            <button onClick={handleComment}>Send</button>
          </div>
        </div>

        {/* COMMENTS */}
        {comments.map((c) => (
          <div className="post-comment" key={c._id}>

            {/* 🔥 COMMENT USER PFP FIX */}
            <div
              className="comment-pfp"
              style={{
                backgroundImage: `url(${
                  c.user?.profilePhoto || defaultPfp
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <div className="comment-box">
              <div className="comment-title">

                <h5
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    router.push(`/user/${c.user?.username}`)
                  }
                >
                  @{c.user?.username || "Unknown"}
                </h5>

                <p>
                  {new Date(c.createdAt).toLocaleString()}
                </p>

              </div>

              <div className="comment-line" />
              <p>{c.text}</p>
            </div>

          </div>
        ))}

      </div>
    </>
  );
}