require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();
const server = http.createServer(app);

// Dev-friendly CORS: allow configured origins + any localhost dev port
const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(Boolean)
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return cb(null, true)
    }
    return cb(null, false)
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}

const io = new Server(server, { cors: corsOptions });

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

app.use('/api/features', require('./src/routes/features'))
app.use('/api/reviews', require('./src/routes/reviews'))
app.use('/api/infosections', require('./src/routes/infosections'))
app.use('/api/homepictures', require('./src/routes/homepictures'))
app.use('/api/auth', require('./src/routes/auth'))

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
