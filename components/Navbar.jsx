"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link href="/">Belzebab</Link>
        </div>

        <ul className={`navbar-menu ${isOpen ? "active" : ""}`}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/pageitems/About">About</Link></li>
          <li><Link href="/pageitems/Contact">Contact</Link></li>
          <li><Link href="/pageitems/SSS">SSS</Link></li>

          {!user ? (
            <>
              <li><Link href="/pageitems/Login">Login</Link></li>
              <li><Link href="/pageitems/Register">Register</Link></li>
            </>
          ) : (
            <>
              <li><Link href={`/profile/${user.username}`}>{user.username}</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          )}
        </ul>

        <div className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
      <hr />
    </nav>
  );
}