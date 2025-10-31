// src/components/Dashboard/Sidebar.jsx
import React from "react";

const Sidebar = () => {
    return (
        <div className="w-64 bg-gray-800 text-white h-screen p-4">
            <h2 className="text-xl font-bold mb-6">Dashboard</h2>
            <ul>
                <li className="mb-3 hover:text-blue-400 cursor-pointer">Overview</li>
                <li className="mb-3 hover:text-blue-400 cursor-pointer">Tasks</li>
                <li className="mb-3 hover:text-blue-400 cursor-pointer">AI Roadmap</li>
                <li className="mb-3 hover:text-blue-400 cursor-pointer">Calendar</li>
            </ul>
        </div>
    );
};

export default Sidebar;
