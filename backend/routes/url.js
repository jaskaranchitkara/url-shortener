import express from 'express';
import Url from '../models/url.js';
import { nanoid } from 'nanoid';

const router = express.Router();

// ✅ TEST ROUTE
router.get('/test', (req, res) => {
  res.send('API working ✅');
});

// ✅ CREATE SHORT URL
router.post('/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let validUrl;
    try {
      validUrl = new URL(originalUrl);
    } catch {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const normalizedUrl = validUrl.href;

    const existing = await Url.findOne({ originalUrl: normalizedUrl });

    if (existing) {
      return res.json({
        shortId: existing.shortId,
        shortUrl: `${process.env.BASE_URL}/${existing.shortId}`
      });
    }

    let shortId;
    let exists = true;

    while (exists) {
      shortId = nanoid(7);
      exists = await Url.findOne({ shortId });
    }

    const newUrl = await Url.create({
      originalUrl: normalizedUrl,
      shortId,
      clicks: 0
    });

    return res.json({
      shortId: newUrl.shortId,
      shortUrl: `${process.env.BASE_URL}/${newUrl.shortId}`
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ✅ GET STATS (MOVE THIS UP)
router.get('/stats/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params;

    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({
      originalUrl: url.originalUrl,
      shortId: url.shortId,
      clicks: url.clicks || 0,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ REDIRECT (KEEP THIS LAST ALWAYS)
router.get('/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params;

    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).send("URL not found ❌");
    }

    url.clicks = (url.clicks || 0) + 1;
    await url.save();

    return res.redirect(url.originalUrl);

  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});

export default router;