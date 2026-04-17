import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    if (!url || loading) return;

    setLoading(true);

    try {
      console.log("Sending request to:", `${API_BASE_URL}/shorten`);

      const res = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url,
      });

      console.log("Response:", res.data);

      const newShortUrl = res.data.shortUrl;

      if (!newShortUrl) {
        throw new Error("No shortUrl returned");
      }

      setShortUrl(newShortUrl);
      setCopied(false);

    } catch (err) {
      console.error("ERROR:", err?.response || err.message);

      alert(
        err?.response?.data?.error ||
        "Backend not reachable or wrong URL"
      );
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-6">
      <h1 className="text-4xl font-bold mb-4 text-center">
        URL SHORTENER
      </h1>

      <div className="flex flex-col gap-3 w-full max-w-3xl">
        <input
          type="text"
          className="input input-success w-full"
          placeholder="Enter long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={handleShorten}
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </div>

      {shortUrl && (
        <div className="flex flex-col items-center max-w-3xl w-full">
          <p className="font-medium mb-2">Your short link:</p>

          <a
            className="link link-primary break-all"
            target="_blank"
            rel="noopener noreferrer"
            href={shortUrl}
          >
            {shortUrl}
          </a>

          <button
            onClick={handleCopy}
            className={`btn mt-2 w-full ${
              copied ? "btn-success" : "btn-secondary"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>

          {/* ✅ FIXED QR */}
          <div className="bg-white p-4 rounded-lg shadow mt-6">
            <p className="mb-2 text-center font-semibold text-gray-800">
              Scan QR Code:
            </p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${shortUrl}`}
              alt="QR Code"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;