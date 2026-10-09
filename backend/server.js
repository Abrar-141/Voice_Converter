require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: [process.env.CLIENT_URL, process.env.ADMIN_URL] }));
app.use(express.json({ limit: '10mb' }));

app.use('/api/features', require('./src/routes/features'))
app.use('/api/reviews', require('./src/routes/reviews'))
app.use('/api/infosections', require('./src/routes/infosections'))

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
});

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
