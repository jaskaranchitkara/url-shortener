import { useState } from "react";
import axios from "axios";

// ✅ API from environment
const API = import.meta.env.VITE_API_URL;

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    if (!url) {
      alert("Please enter a URL");
      return;
    }

    try {
      const res = await axios.post(`${API}/shorten`, {
        originalUrl: url,
      });

      setShortUrl(res.data.shortUrl);
      setCopied(false);
    } catch (err) {
      console.error(err);
      alert("Error shortening URL");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          URL Shortener 🚀
        </h1>

        <input
          type="text"
          placeholder="Enter URL (https://...)"
          className="input input-bordered w-full mb-4"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button className="btn btn-primary w-full" onClick={handleShorten}>
          Shorten URL
        </button>

        {shortUrl && (
          <div className="mt-4 text-center">
            <p className="text-sm mb-2">Short URL:</p>

            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 break-all"
            >
              {shortUrl}
            </a>

            <button className="btn btn-sm mt-2" onClick={handleCopy}>
              {copied ? "Copied ✅" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;