import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    dob: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/users/register/", formData);
      setMessage(res.data.message || "✅ OTP sent successfully!");
      if (res.data.message.includes("OTP")) {
        navigate("/verify-otp", { state: { ...formData } });
      }
    } catch (err) {
      const serverMsg = err.response?.data?.error || err.response?.data?.message;
      setMessage(serverMsg || "❌ Something went wrong!");
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center py-12">
      {/* Animated gradient */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background: `radial-gradient(circle 600px at ${mousePosition.x}% ${mousePosition.y}%, black, transparent)`,
        }}
      />

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute border border-black/5"
            style={{
              width: `${80 + i * 30}px`,
              height: `${80 + i * 30}px`,
              left: `${(i * 20) % 100}%`,
              top: `${(i * 15) % 100}%`,
              animation: `float-random ${8 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-black/20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-black/20" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-black/20" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-black/20" />

      {/* Main form */}
      <div
        className={`relative z-10 bg-white border-4 border-black p-12 w-full max-w-2xl transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
      >
        <h2 className="text-5xl font-black text-center mb-2 tracking-tighter">
          REGISTER
        </h2>
        <div className="h-1 w-20 bg-black mx-auto mb-8" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label className="block text-xs font-black tracking-widest mb-2 uppercase">
                Username
              </label>
              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                className="w-full px-4 py-3 border-2 border-black bg-white focus:bg-black focus:text-white outline-none transition-all duration-300 font-mono"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black tracking-widest mb-2 uppercase">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border-2 border-black bg-white focus:bg-black focus:text-white outline-none transition-all duration-300 font-mono"
                required
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-black tracking-widest mb-2 uppercase">
                Full Name
              </label>
              <input
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 border-2 border-black bg-white focus:bg-black focus:text-white outline-none transition-all duration-300 font-mono"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-black tracking-widest mb-2 uppercase">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-black bg-white focus:bg-black focus:text-white outline-none transition-all duration-300 font-mono"
                required
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-black tracking-widest mb-2 uppercase">
                Date of Birth
              </label>
              <input
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-black bg-white focus:bg-black focus:text-white outline-none transition-all duration-300 font-mono"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-black tracking-widest mb-2 uppercase">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1234567890"
                className="w-full px-4 py-3 border-2 border-black bg-white focus:bg-black focus:text-white outline-none transition-all duration-300 font-mono"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="group relative w-full py-4 bg-black text-white font-black text-lg tracking-widest uppercase overflow-hidden hover:bg-white hover:text-black hover:border-4 hover:border-black transition-all duration-300"
          >
            <span className="relative z-10">CREATE ACCOUNT</span>
          </button>
        </form>

        {/* Message */}
        {message && (
          <div
            className={`mt-6 p-3 border-2 text-center font-mono text-sm ${message.includes("✅")
              ? "border-black bg-black text-white"
              : "border-black bg-white text-black"
              }`}
          >
            {message}
          </div>
        )}

        {/* Login Link */}
        <p className="text-center text-xs mt-8 font-bold tracking-wider">
          ALREADY HAVE AN ACCOUNT?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-black underline hover:no-underline"
          >
            LOGIN HERE
          </button>
        </p>

        {/* Decorative corners */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-black" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-black" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-black" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-black" />
      </div>
    </div>
  );
}