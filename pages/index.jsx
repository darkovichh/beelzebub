"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();

        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("API returned non-array:", data);
          setPosts([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />

      <div className="home">
        <div className="home-shadow">
          <div className="home-main">

            <div className="posts">

              <div className="post-detail">
                <ul>
                  <li>user</li>
                  <li>title</li>
                  <li>category</li>
                  <li>date</li>
                  <li>views</li>
                  <li>comments</li>
                </ul>
              </div>

              {Array.isArray(posts) &&
                posts.map((post) => {
                  const date = post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "-";

                  return (
                    <div key={post._id} className="post-row">
                      <ul>
                        <li
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/user/${post.user?.username}`);
                          }}
                          style={{ cursor: "pointer", color: "#4ea1ff" }}
                        >
                          @{post.user?.username || "Unknown"}
                        </li>

                        <li
                          onClick={() =>
                            router.push(`/userPost/${post._id}`)
                          }
                          style={{ cursor: "pointer", fontWeight: "bold" }}
                        >
                          {post.title || "No title"}
                        </li>

                        <li>{post.category || "-"}</li>
                        <li>{date}</li>
                        <li>{post.views || 0}</li>
                        <li>{post.commentCount || 0}</li>
                      </ul>
                    </div>
                  );
                })}

            </div>

          </div>
        </div>
      </div>
    </>
  );
}