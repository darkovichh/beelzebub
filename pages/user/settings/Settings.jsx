"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();

  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [profilePhoto, setProfilePhoto] = useState("");
  const [banner, setBanner] = useState("");

  const [previewPfp, setPreviewPfp] = useState("");
  const [previewBanner, setPreviewBanner] = useState("");

  const [userId, setUserId] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(stored);

      setUserId(user._id || "");
      setBio(user.bio || "");
      setUsername(user.username || "");
      setProfilePhoto(user.profilePhoto || "");
      setBanner(user.banner || "");

      setPreviewPfp(user.profilePhoto || "");
      setPreviewBanner(user.banner || "");
    } catch (err) {
      console.error(err);
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handlePfpChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64 = await toBase64(file);
      setProfilePhoto(base64);
      setPreviewPfp(base64);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64 = await toBase64(file);
      setBanner(base64);
      setPreviewBanner(base64);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      if (!userId) return;

      const res = await fetch("/api/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          bio: bio.trim(),
          username: username.trim(),
          password: password || undefined,
          profilePhoto,
          banner,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Update failed");
        return;
      }

      // localStorage sync
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🔥 CRITICAL FIX: dynamic route safe redirect
      const newUsername = data.user?.username;

      if (!newUsername) {
        alert("Username missing in response");
        return;
      }

      router.push(`/user/${newUsername}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <Navbar />

      <div className="profile-main">
        <div className="profile-desc">

          <div
            className="profile-banner"
            style={{
              backgroundImage: `url(${previewBanner || "/default-banner.png"})`,
              cursor: "pointer",
            }}
            onClick={() => document.getElementById("bannerInput").click()}
          />

          <input
            id="bannerInput"
            type="file"
            hidden
            accept="image/*"
            onChange={handleBannerChange}
          />

          <div className="profile-pfp-desc">

            <div
              className="profile-pfp"
              style={{
                backgroundImage: `url(${previewPfp || "/default-avatar.png"})`,
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("pfpInput").click()}
            />

            <input
              id="pfpInput"
              type="file"
              hidden
              accept="image/*"
              onChange={handlePfpChange}
            />

            <div className="profile-user-desc">
              <h1>Settings</h1>

              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
              />

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Bio"
              />

              <button onClick={handleSave}>
                Save
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}