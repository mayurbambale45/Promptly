const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
        const users = db.getUsers().map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
