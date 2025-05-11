// src/components/ShortenInput.jsx
import { useState } from "react";
import { apiFetch } from "../api.js";

export default function ShortenForm({ onShortened }) {
  const [longUrl, setLongUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [expireInDays, setExpireInDays] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !longUrl.trim().startsWith("http://") &&
      !longUrl.trim().startsWith("https://")
    ) {
      alert("Please include http:// or https:// in your URL");
      return;
    }

    try {
      const requestData = { longUrl };
      if (customCode) requestData.customCode = customCode;
      if (expireInDays) requestData.expireInDays = parseInt(expireInDays, 10);

      // POST the long URL to be shortened
      const data = await apiFetch("/api/shorten/shortener", {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      setShortenedUrl(data.shortened_URL);
      setLongUrl("");
      setCustomCode("");
      setExpireInDays("");
      onShortened(); // Refresh list of URLs
    } catch (err) {
      console.error("Error response:", err.response?.data);
      if (err.response?.data?.errors?.length) {
        alert("Errors: " + err.response.data.errors.join(", "));
      } else {
        alert(
          "Shortening failed: " + (err.response?.data?.message || err.message)
        );
      }
    }
  };

  return (
    <form id="longurl" onSubmit={handleSubmit}>
      <h3>Paste the URL to be shortened</h3>
      <div className="input-button">
        <input
          className="input-form"
          type="url"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Enter long URL"
          required
        />
        <button className="submit" type="submit">
          Shorten
        </button>
      </div>
      <div className="p">
        <p>
          Short.ly is a free tool to shorten URLs and generate short links URL{" "}
          <br /> shortener allows to create a shortened link making it easy to
          share
        </p>
      </div>
      {shortenedUrl && (
        <div>
          <p>Shortened URL:</p>
          <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">
            {shortenedUrl}
          </a>
        </div>
      )}
    </form>
  );
}
