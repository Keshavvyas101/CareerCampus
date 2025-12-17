import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  FiHome,
  FiFileText,
  FiSearch,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const Navbar = () => {
  const { setAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setAuthenticated(false);
        navigate("/");
      } else {
        console.error("Logout failed.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
    { name: "Resume Review", path: "/resume-review", icon: <FiFileText /> },
    { name: "JD Guidance", path: "/jd-guidance", icon: <FiSearch /> },
    { name: "Profile", path: "/profile", icon: <FiUser /> },
  ];

  return (
    <nav className="relative bg-white shadow-sm border-b border-gray-200 px-6 py-3">
      {/* Wrapper Flex Container */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.657 0-3 1.343-3 3v4h6v-4c0-1.657-1.343-3-3-3z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14v8H5z"
            />
          </svg>
          <span className="text-xl font-semibold text-gray-800">
            Career<span className="font-light">Compass</span>
          </span>
        </div>

        {/* Hamburger menu (small screens) */}
        <button
          className="sm:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Nav Links */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } sm:flex sm:items-center sm:ml-auto sm:gap-4 absolute sm:static top-full left-0 w-full sm:w-auto bg-white sm:bg-transparent px-6 sm:px-0 pb-4 sm:pb-0 z-10`}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}

          {/* Logout */}
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition"
          >
            <FiLogOut className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
