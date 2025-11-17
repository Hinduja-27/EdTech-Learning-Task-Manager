import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h2 className="text-4xl font-bold mb-4">Welcome to EdTech Task Manager</h2>
        <p className="text-gray-700 mb-4">
          Manage student tasks, track progress, and keep learning organized. Teachers can create tasks for students; students can update progress and complete tasks.
        </p>
        <div className="flex gap-3">
          <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded">Get Started</Link>
          <Link to="/login" className="border px-4 py-2 rounded">Login</Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-2">How it works</h3>
        <ol className="list-decimal pl-5 text-gray-700 space-y-2">
          <li>Teachers sign up and login.</li>
          <li>Students sign up and must select a teacher.</li>
          <li>Teachers create tasks assigned to students.</li>
          <li>Students update progress and complete tasks.</li>
        </ol>
      </div>
    </div>
  );
}
