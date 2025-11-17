import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    userId: localStorage.getItem("userId") || null,
    teacherId: localStorage.getItem("teacherId") || null,
    name: localStorage.getItem("name") || null,
  });

  const login = ({ token, role, userId, teacherId = null, name = null }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);
    if (teacherId) localStorage.setItem("teacherId", teacherId);
    if (name) localStorage.setItem("name", name);
    setAuth({ token, role, userId, teacherId, name });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null, userId: null, teacherId: null, name: null });
  };

  return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
};
