// // src/pages/Login.jsx
// import { useState } from "react";
// import api from "../api";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await api.post("/api/auth/login", form);
//     localStorage.setItem("token", res.data.token);
//     navigate("/");
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="p-4 login-form"
//     >
//       <h2 className="text-xl font-bold mb-2">Login</h2>
//       <input
//         type="email"
//         className="input"
//         placeholder="email"
//         value={form.email}
//         onChange={(e) => setForm({ ...form, email: e.target.value })}
//       />
//       <input
//         type="password"
//         className="input"
//         placeholder="Password"
//         value={form.password}
//         onChange={(e) => setForm({ ...form, password: e.target.value })}
//       />
//       <button className="cta">Login</button>
//     </form>
//   );
// }

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
      navigate("/");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 login-form">
      <h2 className="text-xl font-bold mb-2">Login</h2>
      <input
        type="email"
        className="input"
        placeholder="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        className="input"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="cta">Login</button>
    </form>
  );
}
