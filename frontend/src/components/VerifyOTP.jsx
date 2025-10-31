import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State hooks
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Grab email from previous route (registration page)
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      setMessage("Email not provided. Please register again.");
      setTimeout(() => navigate("/register"), 2000);
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setMessage("Please enter the OTP sent to your email.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/verify-otp/", {
        email: email.trim(),
        otp: otp.trim(),
      });

      if (response.status === 201) {
        setMessage("✅ OTP verified successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(response.data?.message || "Unexpected response.");
      }
    } catch (error) {
      if (error.response) {
        // Backend returned an error message
        setMessage(error.response.data?.message || "Invalid OTP or expired.");
      } else {
        setMessage("Server not reachable. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setMessage("Email missing. Please register again.");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/users/resend-otp/", { email });
      setMessage("A new OTP has been sent to your email.");
    } catch (err) {
      const serverMsg = err.response?.data?.message || "Error resending OTP.";
      setMessage(serverMsg);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Verify OTP
        </h2>

        {email && (
          <p className="text-sm text-center text-gray-600 mb-4">
            Enter the OTP sent to <span className="font-semibold">{email}</span>
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              OTP
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").trim())
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-lg ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="w-full py-2 mt-3 text-indigo-600 font-semibold hover:underline"
          >
            Resend OTP
          </button>
        </form>

        {message && (
          <p
            className={`text-center mt-4 text-sm font-medium ${message.startsWith("✅")
              ? "text-green-600"
              : "text-red-600"
              }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyOTP;
