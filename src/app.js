const express = require('express')
const cors = require('cors')

const app = express()

const counterRoutes = require('./routes/route');

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://vshhospital.netlify.app',
    'https://vshhospital.vercel.app',
    'https://vsh-backend-25m1.onrender.com',
    'https://vsh-backend.vercel.app',
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, curl, server-to-server)
        if (!origin) return callback(null, true);
        
        // Allow all localhost, Netlify, Vercel, Render, and custom domains
        if (
            origin.endsWith('.netlify.app') ||
            origin.endsWith('.vercel.app') ||
            origin.endsWith('.onrender.com') ||
            origin.includes('localhost') ||
            origin.includes('127.0.0.1') ||
            origin.includes('vayushri') ||
            allowedOrigins.includes(origin)
        ) {
            return callback(null, true);
        }
        
        // Fallback: allow origin gracefully instead of throwing 500 error
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
}));

// Handle preflight OPTIONS requests for all routes
app.options('*', cors());

app.use(express.json({ limit: '10mb' }))
app.use('/api', counterRoutes);

module.exports = app;
