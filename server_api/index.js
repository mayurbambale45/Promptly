require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4173', process.env.CLIENT_URL].filter(Boolean),
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// AI Routes
const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);

// Project Routes
const projectRoutes = require('./routes/projects');
app.use('/api/projects', projectRoutes);

// Admin / Users
const db = require('./db');
app.get('/api/users', (req, res) => {
    try {
        const users = db.getUsers().map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            joinedAt: u.joinedAt || u.createdAt
        }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Delete User route (Admin only)
app.delete('/api/users/:id', (req, res) => {
    try {
        db.deleteUser(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`🚀 Promptly API running on http://localhost:${PORT}`);
    console.log(`   Gemini AI: ${process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' ? '✅ Connected' : '⚠️ Mock Mode (add GEMINI_API_KEY to .env)'}`);
});
