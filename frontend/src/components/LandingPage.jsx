import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to Planora 🚀</h1>
      <p>Your learning + productivity companion</p>
      <div style={{ marginTop: "40px" }}>
        <Link to="/login"><button>Login</button></Link>
        <Link to="/register" style={{ marginLeft: "10px" }}><button>Register</button></Link>
      </div>
    </div>
  );
}
