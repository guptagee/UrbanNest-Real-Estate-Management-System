const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const bookingRoutes = require('./routes/bookings');
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const inquiryRoutes = require('./routes/inquiries');
const builderRoutes = require('./routes/builders');
const projectRoutes = require('./routes/projects');
const adminProjectRoutes = require('./routes/adminProjects');
const unitRoutes = require('./routes/units');
const reportRoutes = require('./routes/reports');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rems')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/ai', require('./routes/ai')); // AI Routes (Chat & Description)
// app.use('/api/chat', require('./routes/chat')); // Legacy chat route


// Builder/Project/Unit routes
app.use('/api/admin/builders', builderRoutes); // ADMIN ONLY (Legacy/Admin)
app.use('/api/builders', builderRoutes); // Public & Admin
app.use('/api/admin/projects', adminProjectRoutes); // ADMIN ONLY for CRUD
app.use('/api/admin/units', unitRoutes); // ADMIN ONLY (Legacy/Admin)
app.use('/api/units', unitRoutes); // Public & Admin
app.use('/api/projects', projectRoutes); // Public read-only routes for viewing projects

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'REMS API is running',
    aiConfigured: !!process.env.GEMINI_API_KEY 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

