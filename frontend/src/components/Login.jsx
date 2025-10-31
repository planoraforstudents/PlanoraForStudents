import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      setMessage("⚠️ Please enter both email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = { identifier: identifier.trim(), password };
      const res = await axios.post("http://127.0.0.1:8000/api/users/login/", payload);

      if (rememberMe) {
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
      } else {
        sessionStorage.setItem("access_token", res.data.access);
        sessionStorage.setItem("refresh_token", res.data.refresh);
      }

      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      const serverMsg = err.response?.data?.error || err.response?.data?.message;
      setMessage(serverMsg || "❌ Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center">
      {/* Animated gradient following mouse */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 600px at ${mousePosition.x}% ${mousePosition.y}%, black, transparent)`,
        }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute border border-black/5"
            style={{
              width: `${100 + i * 40}px`,
              height: `${100 + i * 40}px`,
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animation: `float-random ${10 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              transform: `rotate(${i * 30}deg)`,
            }}
          />
        ))}
      </div>

      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-black/20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-black/20" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-black/20" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-black/20" />

      {/* Main content */}
      <div
        className={`relative z-10 bg-white border-4 border-black p-12 w-full max-w-md transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
      >
        {/* Title */}
        <h2 className="text-5xl font-black text-center mb-2 tracking-tighter">
          LOGIN
        </h2>
        <div className="h-1 w-20 bg-black mx-auto mb-8" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="group">
            <label className="block text-xs font-black tracking-widest mb-2 uppercase">
              Email Address
            </label>
            <input
              type="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border-2 border-black bg-white focus:bg-black focus:text-white outline-none transition-all duration-300 font-mono"
              required
            />
          </div>

          {/* Password Input */}
          <div className="group">
            <label className="block text-xs font-black tracking-widest mb-2 uppercase">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-black bg-white focus:bg-black focus:text-white outline-none transition-all duration-300 font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-xs font-black hover:scale-110 transition-transform"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative w-5 h-5 border-2 border-black">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="absolute opacity-0 w-full h-full cursor-pointer"
                />
                {rememberMe && (
                  <div className="absolute inset-0 bg-black flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                )}
              </div>
              <span className="font-bold tracking-wider">REMEMBER ME</span>
            </label>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="font-black tracking-wider hover:underline"
            >
              FORGOT?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`group relative w-full py-4 bg-black text-white font-black text-lg tracking-widest uppercase overflow-hidden transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-white hover:text-black hover:border-4 hover:border-black"
              }`}
          >
            <span className="relative z-10">
              {loading ? "LOGGING IN..." : "LOGIN"}
            </span>

            {/* Animated border on hover */}
            <div className="absolute inset-0 border-4 border-white/0 group-hover:border-black transition-all duration-300" />
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

        {/* Register Link */}
        <p className="text-center text-xs mt-8 font-bold tracking-wider">
          NO ACCOUNT?{" "}
          <button
            onClick={() => navigate("/register")}
            className="font-black underline hover:no-underline"
          >
            REGISTER HERE
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