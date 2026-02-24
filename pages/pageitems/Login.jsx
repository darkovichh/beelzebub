"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const identifier = e.target.identifier.value.trim(); // username veya email
    const password = e.target.password.value;

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.message);

    localStorage.setItem("user", JSON.stringify(data.user));
    router.push("/"); // login sonrası anasayfa
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <form className="auth-box" onSubmit={handleSubmit}>
          <h2>Login</h2>
          {error && <p className="error">{error}</p>}
          <input name="identifier" placeholder="Email or Username" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}