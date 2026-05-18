"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();

  const [userData, setUserData] = useState({
    username: "unknown",
    rating: 0,
    bio: "",
    views: 0,
    comments: 0,
    profilePhoto: "/default-avatar.png",
    banner: "/default-banner.png",
  });

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          router.push("/login");
          return;
        }

        const parsedUser = JSON.parse(storedUser);

        if (!parsedUser?.username) return;

        // USER
        const userRes = await fetch(`/api/users/${parsedUser.username}`);
        const user = await userRes.json();

        if (!userRes.ok) return;

        // POSTS
        let postsData = [];
        if (user._id) {
          const postsRes = await fetch(`/api/posts?userId=${user._id}`);
          postsData = await postsRes.json();
        }

        if (!Array.isArray(postsData)) postsData = [];

        // 🔥 TOTALS
        const totalViews = postsData.reduce(
          (sum, p) => sum + (p.views || 0),
          0
        );

        const totalComments = postsData.reduce(
          (sum, p) => sum + (p.commentCount || 0),
          0
        );

        const postCount = postsData.length;

        // 🔥 RATING FORMULA
        const rating = totalViews + totalComments + postCount;

        setPosts(postsData);

        setUserData({
          _id: user._id,
          username: user.username || "unknown",
          bio: user.bio || "",
          profilePhoto: user.profilePhoto || "/default-avatar.png",
          banner: user.banner || "/default-banner.png",

          views: totalViews,
          comments: totalComments,
          rating,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, [router]);

  return (
    <>
      <Navbar />

      <div className="profile-main">
        <div className="profile-desc">

          {/* BANNER */}
          <div
            className="profile-banner"
            style={{
              backgroundImage: `url(${userData.banner})`,
            }}
          />

          {/* USER */}
          <div className="profile-pfp-desc">

            <div
              className="profile-pfp"
              style={{
                backgroundImage: `url(${userData.profilePhoto})`,
              }}
            />

            <div className="profile-user-desc">
              <h1>@{userData.username}</h1>
              <p>rating: {userData.rating}</p>

              <p>
                {userData.bio && userData.bio.trim().length > 0
                  ? userData.bio
                  : "No bio yet.."}
              </p>
            </div>

          </div>

          <div className="profile-line"></div>

          {/* STATS */}
          <div className="profile-desc-count">
            <p>posts: {posts.length}</p>
            <p>views: {userData.views}</p>
            <p>comments: {userData.comments}</p>
          </div>

        </div>

        {/* POSTS */}
        <div className="profile-posts">

          <p>Posts</p>

          <div className="posts-line"></div>

          {posts.length === 0 ? (
            <p>No posts yet</p>
          ) : (
            posts.map((post) => (
              <div
                className="profile-posts-desc"
                key={post._id}
              >
                <h5>{post.title}</h5>
                <p>{post.description}</p>

                <div className="post-raiting">
                  <h4>views: {post.views || 0}</h4>

                  <p>
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </>
  );
}