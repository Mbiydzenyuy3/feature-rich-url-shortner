// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import api from "../api";
import ShortenForm from "../components/shortenInput.jsx";

export default function Dashboard() {
  const [urls, setUrls] = useState([]);

  const fetchUrls = async () => {
    try {
      const res = await api.get("/api/shorten/my-urls");
      setUrls(res.data.urls || []); // Fallback to empty array
    } catch (err) {
      console.error("failed to fetch url", err);
      setUrls([]);
    } 
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Short URLs</h2>
      <ShortenForm onShorten={fetchUrls} />
      <ul className="mt-4 space-y-2">
        {Array.isArray(urls) && urls.map((u) => (
          <li key={u.shortcode} className="border p-2 rounded">
            <p>
              <strong>Short:</strong>{" "}
              <a
                className="text-blue-600 underline"
                href={`${import.meta.env.VITE_API_URL}/s/${u.shortcode}`}
                target="_blank"
              >
                {u.shortcode}
              </a>
            </p>
            <p>
              <strong>Long:</strong> {u.longurl}
            </p>
            <p>
              <strong>Clicks:</strong> {u.clicks} | <strong>Expires:</strong>{" "}
              {u.expiresat || "Never"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
