"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link href="/" onClick={closeMenu}>
            Beelzebub
          </Link>
        </div>

        <ul className={`navbar-menu ${isOpen ? "active" : ""}`}>
          <li><Link href="/" onClick={closeMenu}>Home</Link></li>
          <li><Link href="/pageitems/About" onClick={closeMenu}>About</Link></li>
          <li><Link href="/pageitems/Contact" onClick={closeMenu}>Contact</Link></li>

          {!user ? (
            <>
              <li><Link href="/pageitems/Login" onClick={closeMenu}>Login</Link></li>
              <li><Link href="/pageitems/Register" onClick={closeMenu}>Register</Link></li>
            </>
          ) : (
            <>
              <li><Link href="/pageitems/Post" onClick={closeMenu}>Post Share</Link></li>

              <li
                className="user-wrapper"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <span>{user.username}</span>

                {dropdownOpen && (
                  <div className="user-dropdown">
                    <Link href="/user/profile/Profile" onClick={() => setDropdownOpen(false)}>
                      Profile
                    </Link>

                    <Link href="/user/settings/Settings" onClick={() => setDropdownOpen(false)}>
                      Settings
                    </Link>

                    <div onClick={handleLogout}>
                      Logout
                    </div>
                  </div>
                )}
              </li>
            </>
          )}
        </ul>

        <div
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>

      <hr />

      <style jsx>{`
        .user-wrapper {
          position: relative;
          cursor: pointer;
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: #111;
          border: 1px solid #333;
          border-radius: 8px;
          min-width: 140px;
          z-index: 999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-dropdown a,
        .user-dropdown div {
          padding: 10px;
          cursor: pointer;
          transition: 0.2s;
          color: white;
          text-decoration: none;
        }

        .user-dropdown a:hover,
        .user-dropdown div:hover {
          background: #1f1f1f;
        }
      `}</style>
    </nav>
  );
}