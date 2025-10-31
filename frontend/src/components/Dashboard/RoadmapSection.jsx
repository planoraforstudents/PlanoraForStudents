import React, { useState } from "react";
import axios from "axios";

export default function RoadmapSection() {
    const [goal, setGoal] = useState("");
    const [roadmap, setRoadmap] = useState([]);

    const generateRoadmap = async () => {
        try {
            const res = await axios.post("http://127.0.0.1:8000/api/roadmap/roadmaps/create/", { title: goal, goal });
            setRoadmap([...roadmap, res.data]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">AI Roadmap Generator</h2>
            <div className="flex gap-2 mb-4">
                <input
                    className="border rounded p-2 flex-1"
                    placeholder="Enter your project or career goal..."
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                />
                <button
                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                    onClick={generateRoadmap}
                >
                    Generate
                </button>
            </div>

            <div className="bg-white shadow rounded-lg p-4">
                {roadmap.length === 0 ? (
                    <p>Enter a goal to generate your roadmap.</p>
                ) : (
                    roadmap.map((r) => (
                        <div key={r.id} className="border-b py-2">
                            <h3 className="font-bold text-lg">{r.title}</h3>
                            <p>{r.goal}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
