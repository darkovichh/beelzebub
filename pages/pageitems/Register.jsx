"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const username = e.target.username.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error || "Registration failed");

      router.push("/pageitems/Login"); // register sonrası login sayfasına yönlendir
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
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            <input name="username" placeholder="Username" required />
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" required />
            <button type="submit">Create Account</button>
          </form>
        </div>
      </div>
    </>
  );
}