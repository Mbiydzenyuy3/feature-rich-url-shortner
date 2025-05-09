// src/pages/Register.jsx
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
     console.log("Submitting form:", form);
    await api.post("/api/auth/register", form);
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-2">Register</h2>
      <input
        className="w-full p-2 border mb-2"
        placeholder="Enter Your Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        className="w-full p-2 border mb-2"
        type="email"
        placeholder="Enter Your work email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      ></input>
      <input
        type="password"
        className="w-full p-2 border mb-2"
        placeholder="Enter Your Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="bg-green-500 text-white px-4 py-2 w-full">
        Register
      </button>
    </form>
  );
}
