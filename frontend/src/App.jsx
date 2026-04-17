import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    if (!url || loading) return;

    setLoading(true);

    try {
      console.log("API URL:", API_BASE_URL);

      if (!API_BASE_URL) {
        throw new Error("API URL not set in environment variables");
      }

      const res = await axios.post(
        `${API_BASE_URL}/shorten`, // ✅ change to /api/shorten if needed
        {
          originalUrl: url,
        }
      );

      const newShortUrl = res.data.shortUrl;

      if (!newShortUrl) {
        throw new Error("No short URL returned from backend");
      }

      setShortUrl(newShortUrl);
      setCopied(false);

    } catch (err) {
      console.error("ERROR:", err);

      alert(
        err?.response?.data?.error ||
        err.message ||
        "Backend not reachable"
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
      <h1 className="text-4xl font-bold text-center">
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
          <p className="font-medium mt-4">Your short link:</p>

          <a
            className="link link-primary break-all"
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
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

          {/* QR Code */}
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
