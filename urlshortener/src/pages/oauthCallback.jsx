//src/pages/oauthCallback.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } else {
      alert("Login failed. No token found.");
      navigate("/login");
    }
  }, [location]);

  return <p>Authenticating with Google...</p>;
}
