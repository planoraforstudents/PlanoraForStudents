import React, { useState } from "react";
import OverviewSection from "./OverviewSection";
import RoadmapSection from "./RoadmapSection";
import SchedulerSection from "./SchedulerSection";
import Sidebar from "./Sidebar";

export default function Dashboard() {
    const [activeSection, setActiveSection] = useState("overview");

    const renderSection = () => {
        switch (activeSection) {
            case "overview":
                return <OverviewSection />;
            case "roadmap":
                return <RoadmapSection />;
            case "scheduler":
                return <SchedulerSection />;
            default:
                return <OverviewSection />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 text-gray-900">
            <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />
            <div className="flex-1 p-6 transition-all">{renderSection()}</div>
        </div>
    );
}
