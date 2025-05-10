// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import api from "../api";
import ShortenForm from "../components/ShortenInput.jsx";
import UrlList from "../components/UrlList.jsx";

export default function Dashboard() {
  const [urls, setUrls] = useState([]);

  const fetchUrls = async () => {
    const res = await api.get("/api/my-urls");
    setUrls(res.data.urls);
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div className="shorturl-container">
      <h2 className="text-xl font-bold mb-4">My Short URLs</h2>
      <ShortenForm onShorten={fetchUrls} />
      <UrlList/>
      <ul className="mt-4 space-y-2">
        {urls.map((u) => (
          <li key={u.shortcode} className="border p-2 rounded">
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
