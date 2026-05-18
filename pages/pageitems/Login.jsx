"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const username = e.target.username.value.trim();
    const password = e.target.password.value.trim();

    if (!username || !password) {
      setError("Username ve password gerekli");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // localStorage minimal (auth only)
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: data._id,
          username: data.username,
        })
      );

      // 🔥 IMPORTANT FIX: dynamic profile route
      router.replace(`/user/${data.username}`);

    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-container">
        <div className="auth-container-shadow">
          <form className="auth-box" onSubmit={handleSubmit}>
            <h2>Login</h2>

            {error && <p className="error">{error}</p>}

            <input name="username" placeholder="Username" required />
            <input name="password" type="password" placeholder="Password" required />

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  );
}