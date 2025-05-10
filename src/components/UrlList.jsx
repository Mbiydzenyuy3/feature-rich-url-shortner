export default function UrlList({ urls }) {
  if (!urls || urls.length === 0) {
    return <p>No URLs to display.</p>;
  }

  return (
    <div>
      <h3>My Short URLs</h3>
      <ul>
        {urls.map((url) => (
          <li key={url.shortCode}>
            <strong>{url.shortCode}</strong>:{" "}
            <a href={url.longUrl} target="_blank">
              {url.longUrl}
            </a>{" "}
            (Clicks: {url.clicks})
          </li>
        ))}
      </ul>
    </div>
  );
}
