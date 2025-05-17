// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api.js";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit} className="p-4 login-form">
        <h2 className="text-xl font-bold mb-2">Login</h2>
        <input
          type="email"
          className="input"
          placeholder="Enter email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          className="input"
          placeholder="Enter Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="cta">Login</button>
        <div className="option">
          <p>Create an account if haven't yet? </p>
          <a href="/register" className="create-account">
            Create account
          </a>
        </div>
      </form>
    </div>
  );
}
