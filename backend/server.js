// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB接続
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// テスト用ルート
app.get('/', (req, res) => {
  res.send('API is running');
});

// ルーティング
const authRoutes = require('./routes/authRoutes');
const timeRoutes = require('./routes/timeRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/time', timeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});