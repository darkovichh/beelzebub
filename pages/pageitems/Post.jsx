"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function Post() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Anime");
  const [notify, setNotify] = useState(false);

  const handleShare = async () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        alert("Login olmalısın");
        return;
      }

      const user = JSON.parse(storedUser);

      // 🔥 HARD GUARD
      if (!user?.username) {
        alert("User data missing");
        return;
      }

      if (!title.trim() || !desc.trim()) {
        alert("Title ve description boş olamaz");
        return;
      }

      const postData = {
        username: user.username,
        title: title.trim(),
        description: desc.trim(),
        category: category || "Anime",
        createdAt: new Date(),
        views: 0,
      };

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await res.json();

      // 🔥 ERROR HANDLING
      if (!res.ok) {
        throw new Error(data.error || "Post kaydedilemedi");
      }

      // socket emit (safe)
      if (typeof window !== "undefined" && window.socketRef?.current) {
        window.socketRef.current.emit("newPost", data);
      }

      // reset form
      setTitle("");
      setDesc("");
      setCategory("Anime");

      setNotify(true);
      setTimeout(() => setNotify(false), 2000);
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      {notify && <div className="post-success">Post successfully shared</div>}

      <div className="post-main">
        <div className="post-desc">
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Write something..."
          />
        </div>

        <div className="post-sett">
          <p>BELZEBAB</p>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Anime">Anime</option>
            <option value="Manga">Manga</option>
            <option value="Manhwa">Manhwa</option>
            <option value="Manhua">Manhua</option>
            <option value="Spoiler">Spoiler</option>
            <option value="News">News</option>
            <option value="Admin Post">Admin Post</option>
          </select>

          <button type="button" onClick={handleShare}>
            SHARE
          </button>
        </div>
      </div>
    </>
  );
}