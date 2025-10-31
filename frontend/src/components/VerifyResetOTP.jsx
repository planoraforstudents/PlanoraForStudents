import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyResetOTP() {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp.trim()) {
            setMessage("Please enter the OTP sent to your email.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/users/verify-reset-otp/",
                { email, otp }
            );
            setMessage("✅ " + res.data.message);
            setTimeout(() => navigate("/reset-password", { state: { email } }), 1500);
        } catch (err) {
            setMessage(err.response?.data?.message || "Invalid OTP. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Verify OTP
                </h2>

                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 text-gray-700 text-sm font-medium">
                        Enter the OTP sent to <span className="font-semibold">{email}</span>
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full mt-4 py-2 text-white font-semibold rounded-lg ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
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
