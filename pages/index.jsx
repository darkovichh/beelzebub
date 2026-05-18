"use client";

import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("Anonymous");
  const [posts, setPosts] = useState([]);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUsername(JSON.parse(storedUser).username);
    } catch {}

    fetch("/api/socket");
    socketRef.current = io();

    socketRef.current.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("newPost", (post) => {
      setPosts((prev) => [post, ...prev]);
    });

    socketRef.current.on("newComment", ({ postId }) => {
      fetch(`/api/posts/${postId}`)
        .then((res) => res.json())
        .then((updatedPost) => {
          setPosts((prev) =>
            prev.map((p) =>
              p._id === postId ? updatedPost : p
            )
          );
        });
    });

    return () => socketRef.current?.disconnect();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socketRef.current?.emit("sendMessage", {
      text: message,
      username: username || "Anonymous",
      createdAt: new Date().toISOString(),
    });

    setMessage("");
  };

  return (
    <>
      <Navbar />

      <div className="home">
        <div className="home-shadow">
          <div className="home-main">

            {/* CHAT */}
            <div className="chat">
              <h2>Live Chat</h2>

              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <div key={i} className="chat-message">
                    <div className="chat-header">
                      <span className="chat-username">
                        {msg.username}
                      </span>
                      <span className="chat-time">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="chat-text">{msg.text}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && sendMessage()
                  }
                  placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>

            {/* POSTS */}
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

              {posts.map((post) => {
                const date = new Date(post.createdAt).toLocaleDateString(
                  "tr-TR",
                  { day: "2-digit", month: "long", year: "numeric" }
                );

                return (
                  <div key={post._id} className="post-row">

                    <ul>

                      {/* USERNAME → PROFILE */}
                      <li
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/user/${post.user?.username}`);
                        }}
                        style={{ cursor: "pointer", color: "#4ea1ff" }}
                      >
                        @{post.user?.username || "Unknown"}
                      </li>

                      {/* TITLE → POST PAGE */}
                      <li
                        onClick={() =>
                          router.push(`/userPost/${post._id}`)
                        }
                        style={{ cursor: "pointer", fontWeight: "bold" }}
                      >
                        {post.title}
                      </li>

                      <li>{post.category}</li>
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