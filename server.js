const express = require('express');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const channelRoutes = require('./routes/channelRoutes');
const videoRoutes = require('./routes/videoRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/channels', channelRoutes);
app.use('/videos', videoRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('YouTube Analytics API Running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});