import React, { useEffect, useState, useContext } from "react";
import { api, authHeader } from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function StudentDashboard() {
  const { auth } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks", { headers: authHeader(auth.token) });
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load tasks");
    }
  };

  useEffect(() => { fetchTasks(); /* eslint-disable-next-line */ }, []);

  const handleUpdate = async (id, payload) => {
    try {
      await api.put(`/tasks/${id}`, payload, { headers: authHeader(auth.token) });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete task?")) return;
    try {
      await api.delete(`/tasks/${id}`, { headers: authHeader(auth.token) });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
      <div className="space-y-4">
        {tasks.length === 0 ? <p>No tasks assigned to you.</p> : tasks.map(t => (
          <div key={t._id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{t.title}</h3>
                <p className="text-sm text-gray-600">{t.description}</p>
                <p className="text-xs text-gray-500">Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "N/A"}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <select value={t.progress} onChange={e => handleUpdate(t._id, { progress: e.target.value })} className="border p-1 rounded">
                  <option value="not-started">Not started</option>
                  <option value="in-progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(t._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
