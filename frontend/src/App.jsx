import { useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleShorten = async () => {
    try {
      const res = await axios.post("http://localhost:8000/shorten", {
        originalUrl: url,
      });

      setShortUrl(res.data.shortUrl);
    } catch (err) {
      alert("Error shortening URL");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          URL Shortener
        </h1>

        <input
          type="text"
          placeholder="Enter URL"
          className="input input-bordered w-full mb-4"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button className="btn btn-primary w-full" onClick={handleShorten}>
          Shorten URL
        </button>

        {shortUrl && (
          <div className="mt-4 text-center">
            <p className="text-sm mb-1">Short URL:</p>

            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 break-all"
            >
              {shortUrl}
            </a>

            {/* COPY BUTTON */}
            <button
              className="btn btn-secondary w-full mt-3"
              onClick={() => {
                navigator.clipboard.writeText(shortUrl);
                alert("Copied!");
              }}
            >
              Copy Link
            </button>

            {/* QR CODE */}
            <div className="mt-4 flex justify-center">
              <QRCode value={shortUrl} size={150} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;