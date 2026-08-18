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
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, curl)
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            origin.startsWith('http://localhost:') ||
            origin.startsWith('http://127.0.0.1:')
        ) {
            return callback(null, true);
        }
        return callback(new Error(`CORS: Origin ${origin} not allowed`), false);
    },
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }))
app.use('/api', counterRoutes);

module.exports = app;
