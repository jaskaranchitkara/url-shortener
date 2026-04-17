import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import urlRoutes from './routes/url.js';

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api', urlRoutes);

// test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// PORT FIX (IMPORTANT)
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});