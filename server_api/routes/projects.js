const express = require('express');
const router = express.Router();
const db = require('../db');

// In a real app, we'd use middleware to verify JWT and get user ID
// For this prototype, we'll pass userId in the body or query

router.get('/:userId', (req, res) => {
    try {
        const projects = db.getProjects().filter(p => p.userId === req.params.userId);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

router.post('/', (req, res) => {
    try {
        const { userId, idea, domain, blueprint } = req.body;
        const newProject = {
            id: Date.now().toString(),
            userId,
            idea,
            domain,
            blueprint,
            createdAt: new Date().toISOString()
        };
        db.addProject(newProject);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save project' });
    }
});

module.exports = router;
