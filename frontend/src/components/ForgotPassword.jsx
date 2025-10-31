import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setMessage("⚠️ Please enter your email address.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/api/users/request-password-reset/",
                { email }
            );

            setMessage("✅ " + res.data.message);

            // Redirect to OTP verification after success
            setTimeout(() => {
                navigate("/verify-reset-otp", { state: { email } });
            }, 1500);
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                "❌ Unable to send OTP. Please try again later.";
            setMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Forgot Password
                </h2>

                <p className="text-sm text-gray-600 text-center mb-4">
                    Enter your registered email and we’ll send you an OTP to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 text-white font-semibold rounded-lg transition ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </form>

                {message && (
                    <p
                        className={`text-center mt-4 text-sm font-medium ${message.includes("✅")
                            ? "text-green-600"
                            : message.includes("⚠️")
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                    >
                        {message}
                    </p>
                )}

                <p className="text-center text-sm text-gray-600 mt-6">
                    Remembered your password?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-indigo-600 font-medium hover:underline"
                    >
                        Back to Login
                    </button>
                </p>
            </div>
        </div>
    );
}
