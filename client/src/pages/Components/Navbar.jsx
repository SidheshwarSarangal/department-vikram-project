import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../Assets/css/navbar.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleHomeClick = () => {
    navigate("/home");
    setMenuOpen(false);
  };

  const handleRecentlyAddedClick = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  const handleCart = () => {
    if (user.userType === "user") {
      navigate("/cart");
    } else {
      navigate("/borrower");
    }
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await axios
      .post(`http://localhost:5000/logout`, null, {
        withCredentials: true,
      })
      .then((response) => {
        const message = response.data.msg;
        const status = response.status;

        if (status === 200) {
          toast.success(`${message}`, {
            position: "top-center",
            autoClose: 2000,
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        } else if (status === 202) {
          toast.warn(`${message}`, {
            position: "top-center",
            autoClose: 2000,
          });
        }
      });
  };

  const isLinkActive = (path) => location.pathname === path;

  return (
    <div className="nav-top">
      <div className="nav-inner-top">
        <div
          onClick={handleHomeClick}
          style={{
            fontSize: "2rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Library
        </div>

        {/* fburger icon only for small screens */}
        <div
          className="hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? "✕" : "☰"}
        </div>

        {/* Normal nav links */}
        <div className={`nav-links ${menuOpen ? "mobile-menu" : ""}`}>
          <div
            className={`linked ${isLinkActive("/home") ? "underline-link" : ""}`}
            onClick={handleHomeClick}
          >
            Books
          </div>
          <div
            className={`linked ${
              isLinkActive("/borrower") || isLinkActive("/cart")
                ? "underline-link"
                : ""
            }`}
            onClick={handleCart}
          >
            {user.userType === "user" ? "Cart" : "Borrower"}
          </div>
          <div
            className={`linked ${
              isLinkActive("/profile") ? "underline-link" : ""
            }`}
            onClick={handleRecentlyAddedClick}
          >
            Profile
          </div>
          <div
            className={`linked ${isLinkActive("/") ? "underline-link" : ""}`}
            onClick={handleLogout}
          >
            Logout
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Navbar;
