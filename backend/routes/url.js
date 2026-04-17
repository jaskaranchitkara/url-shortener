import express from 'express';
import Url from '../models/url.js';
import { nanoid } from 'nanoid';

const router = express.Router();

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

    // check existing
    const existing = await Url.findOne({ originalUrl: normalizedUrl });

    if (existing) {
      return res.json({
        shortId: existing.shortId,
        shortUrl: `${process.env.BASE_URL}/${existing.shortId}` // ✅ FIXED
      });
    }

    // generate unique id
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
      shortUrl: `${process.env.BASE_URL}/${newUrl.shortId}` // ✅ FIXED
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});


// ✅ REDIRECT SHORT URL (NO CHANGE)
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