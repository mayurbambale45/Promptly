const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const crypto = require('crypto');

const JWT_SECRET = 'promptly-secret-key-change-in-prod';

router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const existing = db.findUserByEmail(email);
        if (existing) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        // Auto-admin for specific email for demo
        const role = email === 'admin@promptly.ai' ? 'admin' : 'user';

        const user = {
            id: crypto.randomUUID(),
            email,
            password: hashedPassword,
            name,
            role,
            createdAt: new Date().toISOString()
        };

        db.addUser(user);

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = db.findUserByEmail(email);
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;
