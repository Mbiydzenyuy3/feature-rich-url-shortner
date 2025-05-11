export default function UrlList({ urls }) {
  return (
    <div className="url-list">
      <h3>List URLs</h3>
      <ul>
        {urls.map((u) => (
          <li key={u.shortCode}>
            <a href={u.longUrl} target="_blank" rel="noopener noreferrer">
              {u.long_url}
            </a>{" "}
            <strong>{u.short_code}</strong> {/* (Clicks: {u.click_count}) */}
          </li>
        ))}
      </ul>
    </div>
  );
}
