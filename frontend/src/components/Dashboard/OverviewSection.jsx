import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OverviewSection() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/dashboard/tasks/")
            .then((res) => setTasks(res.data))
            .catch((err) => console.error(err));
    }, []);

    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status !== "completed").length;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Today's Overview</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-100 text-green-700 rounded-lg shadow">✅ Completed: {completed}</div>
                <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg shadow">🕒 Pending: {pending}</div>
                <div className="p-4 bg-blue-100 text-blue-700 rounded-lg shadow">📅 Total Tasks: {tasks.length}</div>
            </div>

            <h3 className="text-xl font-medium mb-2">All Tasks</h3>
            <div className="bg-white rounded-lg shadow p-4">
                {tasks.length === 0 ? (
                    <p>No tasks yet.</p>
                ) : (
                    <ul>
                        {tasks.map((task) => (
                            <li key={task.id} className="border-b last:border-none py-2">
                                <span className="font-semibold">{task.title}</span> — {task.status}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
