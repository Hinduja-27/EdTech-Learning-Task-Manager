import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", teacherId: "" });
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    api.get("/users/teachers").then(res => setTeachers(res.data.teachers || [])).catch(() => setTeachers([]));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", form);
      alert("Signup successful. Login now.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="w-full p-2 border rounded" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <select className="w-full p-2 border rounded" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        {form.role === "student" && (
          <select className="w-full p-2 border rounded" value={form.teacherId} onChange={e => setForm({ ...form, teacherId: e.target.value })} required>
            <option value="">Select your teacher</option>
            {teachers.map(t => (<option key={t._id} value={t._id}>{t.name || t.email}</option>))}
          </select>
        )}

        <button className="w-full bg-blue-600 text-white p-2 rounded">Signup</button>
      </form>
    </div>
  );
}
