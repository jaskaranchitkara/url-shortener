import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import urlRoutes from './routes/url.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ TEST ROUTE
app.get("/test", (req, res) => {
  res.send("API working ✅");
});

// ✅ ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Server working ✅");
});

// ✅ IMPORTANT: use routes correctly
app.use("/api", urlRoutes);

// ❗ fallback route (this was missing / causing confusion)
app.use((req, res) => {
  res.status(404).send("Route not found ❌");
});

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('Connected to MongoDB');

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('Error connecting to MongoDB', err);
});