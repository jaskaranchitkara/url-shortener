import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    if (!url) {
      alert("Enter a URL");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API}/shorten`, {
        originalUrl: url.trim(),
      });

      setShortUrl(res.data.shortUrl);
      setCopied(false);
    } catch (err) {
      alert("Error shortening URL");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white px-4">
      
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">

        <h1 className="text-3xl font-bold text-center mb-6">
          🔗 URL Shortener
        </h1>

        <p className="text-center text-gray-300 mb-6 text-sm">
          Paste your long link and get a short one instantly
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="https://example.com/very-long-link..."
            className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-300"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={handleShorten}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            {loading ? "..." : "Shorten"}
          </button>
        </div>

        {shortUrl && (
          <div className="mt-6 bg-black/30 p-4 rounded-lg border border-white/10">
            <p className="text-sm text-gray-300 mb-2">Your short link:</p>

            <div className="flex items-center justify-between gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 break-all text-sm"
              >
                {shortUrl}
              </a>

              <button
                onClick={handleCopy}
                className="bg-white/20 px-3 py-1 rounded-md text-sm hover:bg-white/30 transition"
              >
                {copied ? "Copied ✅" : "Copy"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;