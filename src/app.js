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

app.use(express.json({ limit: '10mb' }))
app.use('/api', counterRoutes);

module.exports = app;
