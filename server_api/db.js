const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], projects: [] }, null, 2));
}

function readDb() {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeDb(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
    getUsers: () => readDb().users,
    addUser: (user) => {
        const db = readDb();
        db.users.push(user);
        writeDb(db);
        return user;
    },
    findUserByEmail: (email) => {
        return readDb().users.find(u => u.email === email);
    },
    deleteUser: (id) => {
        const db = readDb();
        db.users = db.users.filter(u => u.id !== id);
        writeDb(db);
    },
    getProjects: () => readDb().projects,
    addProject: (project) => {
        const db = readDb();
        db.projects.push(project);
        writeDb(db);
        return project;
    },
    deleteProject: (id) => {
        const db = readDb();
        db.projects = db.projects.filter(p => p.id !== id);
        writeDb(db);
    },
    getProjectsByUser: (userId) => {
        return readDb().projects.filter(p => p.userId === userId);
    },
    getStats: () => {
        const db = readDb();
        return {
            totalUsers: db.users.length,
            totalProjects: db.projects.length,
            usersByRole: db.users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {})
        };
    }
};
