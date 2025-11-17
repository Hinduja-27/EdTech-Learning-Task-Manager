import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center gap-4">
      <div className="md:hidden">
        <button onClick={() => setOpen(!open)} className="text-white">
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div className={`md:flex md:items-center ${open ? "" : "hidden md:flex"}`}>
        <Link to="/" className="text-white mr-4 hover:underline">Home</Link>
        {!auth.token && (
          <>
            <Link to="/login" className="text-white mr-4">Login</Link>
            <Link to="/signup" className="text-white">Signup</Link>
          </>
        )}
        {auth.token && (
          <>
            <Link to="/dashboard" className="text-white mr-4">Dashboard</Link>
            <button onClick={handleLogout} className="bg-white text-blue-700 px-3 py-1 rounded">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
