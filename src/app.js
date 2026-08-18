const express = require('express')
const cors = require('cors')

const app = express()

const counterRoutes = require('./routes/route');

// Enable CORS for all incoming origins (Netlify, Vercel, Localhost, Custom Domains)
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With']
}));

// Handle preflight OPTIONS requests for all routes
app.options('*', cors());

const connectDB = require('./config/db');

// Ensure database connection on each serverless invocation
app.use(async (req, res, next) => {
    try {
        await connectDB();
    } catch (e) {
        console.error('Database connection error in request:', e.message);
    }
    next();
});

// Root & Health Check Routes
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'online',
        message: 'Vayushri Hospital Backend API is running smoothly',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        uptime: process.uptime(),
        database: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

app.use(express.json({ limit: '10mb' }));
app.use('/api', counterRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Server Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

module.exports = app;
