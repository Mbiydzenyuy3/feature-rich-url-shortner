// src/components/ShortenForm.jsx
import { useState } from "react";
import api from "../api";

export default function ShortenForm({ onShorten }) {
  const [longUrl, setLongUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/api/shorten", { longUrl });
    setLongUrl("");
    onShorten();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
        placeholder="Enter long URL"
        className="border p-2 w-full mb-2"
      />
      <button className="bg-purple-600 text-white px-4 py-2 w-full">
        Shorten
      </button>
    </form>
  );
}
