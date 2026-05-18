import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";

export default function Profile() {
  const router = useRouter();

  const [userData, setUserData] = useState({
    username: "unknown",
    rating: 0,
    bio: "",
    posts: 0,
    views: 0,
    comments: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    if (!parsedUser?.username) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      const res = await fetch(`/api/users/${parsedUser.username}`);
      const data = await res.json();

      if (!res.ok) return;

      setUserData(data);
    };

    fetchData();
  }, [router]);

  return (
    <>
      <Navbar />

      <div className="profile-main">

        <div className="profile-desc">

          <div className="profile-banner"></div>

          <div className="profile-pfp-desc">

            <div className="profile-pfp"></div>

            <div className="profile-user-desc">
              <h1>@{userData.username}</h1>
              <p>raiting: {userData.rating}</p>
              <span><p>bio: {userData.bio}</p></span>
            </div>

          </div>

          <div className="profile-line"></div>

          <div className="profile-desc-count">
            <p>posts: {userData.posts}</p>
            <p>views: {userData.views}</p>
            <p>comments: {userData.comments}</p>
          </div>

        </div>

        <div className="profile-posts"></div>

      </div>
    </>
  );
}