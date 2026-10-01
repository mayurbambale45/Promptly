const express = require('express');
const router = express.Router();
const db = require('../db');

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
        const { userId, idea, domain, blueprint, subDomain } = req.body;
        const newProject = {
            id: Date.now().toString(),
            userId,
            idea,
            domain,
            subDomain: subDomain || '',
            blueprint,
            createdAt: new Date().toISOString()
        };
        db.addProject(newProject);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save project' });
    }
});

router.delete('/:projectId', (req, res) => {
    try {
        db.deleteProject(req.params.projectId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

module.exports = router;
