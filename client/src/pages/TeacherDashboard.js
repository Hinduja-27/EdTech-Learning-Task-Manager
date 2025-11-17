import React, { useEffect, useState, useContext } from "react";
import { api, authHeader } from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function TeacherDashboard() {
  const { auth } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });
  const [myTasks, setMyTasks] = useState([]);
  const [studentTasks, setStudentTasks] = useState([]);

  const fetchAll = async () => {
    try {
      const [studRes, tasksRes] = await Promise.all([
        api.get("/users/my-students", { headers: authHeader(auth.token) }),
        api.get("/tasks", { headers: authHeader(auth.token) })
      ]);
      setStudents(studRes.data.students || []);
      if ((studRes.data.students || []).length && !selectedStudent) setSelectedStudent(studRes.data.students[0]._id);
      setMyTasks(tasksRes.data.tasks.created || []);
      setStudentTasks(tasksRes.data.tasks.studentTasks || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load teacher data");
    }
  };

  useEffect(() => { fetchAll(); /* eslint-disable-next-line */ }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return alert("Select a student first");
    try {
      await api.post("/tasks", { ...form, assignedTo: selectedStudent }, { headers: authHeader(auth.token) });
      setForm({ title: "", description: "", dueDate: "" });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Create failed");
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`, { headers: authHeader(auth.token) });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleEdit = async (taskId, payload) => {
    try {
      await api.put(`/tasks/${taskId}`, payload, { headers: authHeader(auth.token) });
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="md:flex gap-6">
      <div className="md:w-1/3 card">
        <h3 className="text-lg font-semibold mb-2">Assign Task to Student</h3>

        <label className="block text-sm text-gray-600 mb-1">Choose Student</label>
        <select className="w-full p-2 border rounded mb-3" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
          <option value="">-- select student --</option>
          {students.map(s => <option key={s._id} value={s._id}>{s.name || s.email}</option>)}
        </select>

        <form onSubmit={handleCreate} className="space-y-2">
          <input className="w-full p-2 border rounded" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <textarea className="w-full p-2 border rounded" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <input className="w-full p-2 border rounded" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          <button className="w-full bg-blue-600 text-white p-2 rounded">Create Task</button>
        </form>
      </div>

      <div className="md:flex-1 space-y-4">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Your Tasks (editable)</h3>
          {myTasks.length === 0 ? <p>No tasks created by you.</p> : myTasks.map(t => (
            <div key={t._id} className="border p-3 rounded mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <strong className="text-lg">{t.title}</strong>
                  <p className="text-sm text-gray-600">{t.description}</p>
                  <p className="text-xs text-gray-500">Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "N/A"}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select value={t.progress} onChange={e => handleEdit(t._id, { progress: e.target.value })} className="border p-1 rounded">
                    <option value="not-started">Not started</option>
                    <option value="in-progress">In progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button onClick={() => handleDelete(t._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Students' Tasks (read-only)</h3>
          {studentTasks.length === 0 ? <p>No tasks by students yet.</p> : studentTasks.map(t => (
            <div key={t._id} className="border p-3 rounded mb-2">
              <strong>{t.title}</strong>
              <p className="text-sm">{t.description}</p>
              <p className="text-xs text-gray-500">Student: {t.assignedTo?.name || t.assignedTo || "Student"}</p>
              <p className="text-xs text-gray-500">Progress: {t.progress}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
