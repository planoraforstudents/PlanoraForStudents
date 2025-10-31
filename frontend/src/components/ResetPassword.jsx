import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPassword() {
    const location = useLocation();
    const email = location.state?.email || "";
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirm) {
            setMessage("Please fill in all fields.");
            return;
        }
        if (password !== confirm) {
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/users/reset-password/",
                { email, new_password: password }
            );

            setMessage("✅ " + res.data.message);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Reset Password
                </h2>

                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 text-gray-700 text-sm font-medium">
                        New Password
                    </label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <label className="block mb-2 mt-3 text-gray-700 text-sm font-medium">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Re-enter new password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full mt-4 py-2 text-white font-semibold rounded-lg ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                {message && (
                    <p
                        className={`text-center mt-4 text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
