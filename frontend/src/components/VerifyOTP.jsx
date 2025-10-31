import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function VerifyOTP() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // If registration form passed state, prefill fields
  const initialState = location.state || {};
  const [username] = useState(initialState.username || "");
  const [password] = useState(initialState.password || "");
  const [full_name] = useState(initialState.full_name || "");
  const [dob] = useState(initialState.dob || "");
  const [phone] = useState(initialState.phone || "");

  // Pre-fill email if passed from registration
  React.useEffect(() => {
    if (initialState.email) setEmail(initialState.email);
  }, [initialState.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send OTP plus the original registration data so backend can create the user
      const payload = {
        email,
        otp,
        username,
        full_name,
        password,
        dob,
        phone,
      };

      const res = await axios.post("http://127.0.0.1:8000/api/users/verify-otp/", payload);
      setMessage(res.data.message);
      if (res.data.message.toLowerCase().includes("successful")) {
        navigate("/login", { state: { email: email } });
      }
    } catch (err) {
      // prefer backend `error` key, then `message`, then a fallback
      const serverMsg = err.response?.data?.error || err.response?.data?.message;
      setMessage(serverMsg || "Invalid OTP");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
        <button type="submit">Verify</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
