import { useState } from "react";
import api from "../api.js";

export default function ShortenForm({ onShortened }) {
  const [longUrl, setLongUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/shorten", { longUrl });
      setLongUrl("");
      onShortened();
    } catch (err) {
      alert("Shortening failed");
    }
  };

  return (
    <form id="longurl" onSubmit={handleSubmit}>
      <input id="longurl-inputfield"
        type="url"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
        placeholder="Enter long URL"
        required
      />
      <button className="submit" type="submit">Submit</button>
    </form>
  );
}
