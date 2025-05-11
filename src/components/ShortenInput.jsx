// import { useState } from "react";
// import api from "../api.js";

// export default function ShortenForm({ onShortened }) {
//   const [longUrl, setLongUrl] = useState("");
//   const [customCode, setCustomCode] = useState("");
//   const [expireInDays, setExpireInDays] = useState("");
//   const [shortenedUrl, setShortenedUrl] = useState(""); // State for holding the shortened URL

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       !longUrl.trim().startsWith("http://") &&
//       !longUrl.trim().startsWith("https://")
//     ) {
//       alert("Please include http:// or https:// in your URL");
//       return;
//     }

//     try {
//       const requestData = {
//         longUrl,
//       };
//       console.log(longUrl);

//       if (customCode) {
//         requestData.customCode = customCode;
//       }

//       if (expireInDays) {
//         requestData.expireInDays = parseInt(expireInDays, 10);
//       }

//       const response = await api.post("/api/shorten/shortener", requestData);
//       const { shortened_URL } = response.data; // Get the shortened URL from the response

//       // Update the state with the shortened URL
//       setShortenedUrl(shortened_URL);

//       // Clear the form fields
//       setLongUrl("");
//       setCustomCode("");
//       setExpireInDays("");

//       // Optionally, you can call `onShortened()` here, if you want to trigger some parent callback
//       onShortened();
//     } catch (err) {
//       console.error("Error response:", err.response?.data);
//       if (err.response?.data?.errors?.length) {
//         alert("Errors: " + err.response.data.errors.join(", "));
//       } else {
//         alert(
//           "Shortening failed: " + (err.response?.data?.message || err.message)
//         );
//       }
//     }
//   };

//   return (
//     <form id="longurl" onSubmit={handleSubmit}>
//       <input
//         className="input-form"
//         type="url"
//         value={longUrl}
//         onChange={(e) => setLongUrl(e.target.value)}
//         placeholder="Enter long URL"
//         required
//       />
//       {/* <input
//         type="text"
//         value={customCode}
//         onChange={(e) => setCustomCode(e.target.value)}
//         placeholder="Custom short code (optional)"
//       /> */}
//       {/* <input
//         type="number"
//         value={expireInDays}
//         onChange={(e) => setExpireInDays(e.target.value)}
//         placeholder="Expire in days (optional)"
//         min="1"
//       /> */}
//       <button className="submit" type="submit">
//         Shorten
//       </button>

//       {/* Display the shortened URL after successful creation */}
//       {shortenedUrl && (
//         <div>
//           <p>Shortened URL:</p>
//           <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">
//             {shortenedUrl}
//           </a>
//         </div>
//       )}
//     </form>
//   );
// }

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
