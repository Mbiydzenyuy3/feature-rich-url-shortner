// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api.js";
import Dialog from "../components/Dialoguebox.jsx"; 

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const navigate = useNavigate();

  const isFormValid = () => {
    return form.email?.trim() && form.password?.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setDialogMessage("wrong credentials, try again");
      setShowDialog(true);
      return;
    }

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (err) {
      setDialogMessage("Registration failed: " + err.message);
      setShowDialog(true);
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
        <div
          className="option"
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          <p>Create an account if haven't yet? </p>
          <a href="/register" className="create-account">
            Create account
          </a>
          <button
            type="button"
            className="cta mt-4 bg-white border text-black flex items-center justify-center"
            onClick={() => {
              window.location.href =
                "http://https://feature-rich-url-shortner-production.up.railway.app/api/oauth/google/callback";
            }}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
              style={{ width: 20, marginRight: 8 }}
            />
            Continue with Google
          </button>
        </div>
      </form>
      {showDialog && (
        <Dialog
          title="Form Error"
          message={dialogMessage}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}
