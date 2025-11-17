import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { auth } = useContext(AuthContext);

  if (!auth.token) return <Navigate to="/login" replace />;

  if (auth.role === "teacher") return <TeacherDashboard />;
  return <StudentDashboard />;
}
