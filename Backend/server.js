// // src/server.js

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
// const authRoutes = require('./routes/auth');
// const driverRoutes = require('./routes/driver');
// const adminRoutes = require('./routes/admin'); // Import admin routes
// const rideRequestRouter = require('./routes/RideRequestSchema'); // Adjust path as needed


// dotenv.config();

// const app = express();
// // app.use(cors());
// app.use(express.json());
// app.use(cors({
//     origin: 'http://localhost:3000', // Your frontend URL
//     methods: 'GET,POST,PUT,DELETE,PATCH',
//     allowedHeaders: 'Content-Type,Authorization'
// }));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true })); // For parsing URL-encoded bodies

// const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch((err) => console.error('Could not connect to MongoDB', err));

// // Register user routes
// app.use('/api/auth', authRoutes);

// // Register driver routes
// app.use('/api/driver', driverRoutes);

// // Register admin routes
// app.use('/api/admin', adminRoutes); // Add this line to include admin routes

// // Use the ride request router
// app.use('/api/ride-request', rideRequestRouter); // All routes defined in the router will now be prefixed with /api


// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });




const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const http = require('http');  // Import http for socket.io
const { Server } = require('socket.io');  // Import Socket.io

const authRoutes = require('./routes/auth');
const driverRoutes = require('./routes/driver');
const adminRoutes = require('./routes/admin');
const rideRequestRouter = require('./routes/RideRequestSchema'); // Adjust path as needed

dotenv.config();

const app = express();

// Create the server using http, passing the express app
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE,PATCH',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ride-request', rideRequestRouter);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user or driver connected:', socket.id);

  // Listen for 'join' event to allow users (drivers) to join specific rooms
  socket.on('join', (role, userId) => {
    if (role === 'driver') {
      socket.join(`driver_${userId}`);  // Driver joins a room with their userId
      console.log(`Driver ${userId} has joined the room`);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user or driver disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export io instance for use in controllers
module.exports = { io };
