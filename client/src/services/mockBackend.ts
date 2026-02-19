import { User, Project } from '../types';

const USERS_KEY = 'promptly_users';
const PROJECTS_KEY = 'promptly_projects';
const CURRENT_USER_KEY = 'promptly_current_user';

const INITIAL_ADMIN: User = {
    id: 'admin-1',
    email: 'admin@promptly.ai',
    name: 'Admin User',
    role: 'admin',
    joinedAt: new Date().toISOString(),
};

// Helper to simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockBackend = {
    // --- Auth ---
    login: async (email: string, password: string): Promise<User> => {
        await delay(500);
        if (email === 'admin@promptly.ai' && password === 'admin') {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(INITIAL_ADMIN));
            return INITIAL_ADMIN;
        }

        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const user = users.find((u: any) => u.email === email);

        if (user) { // In a real app, check password
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            return user;
        }
        throw new Error('Invalid credentials');
    },

    signup: async (email: string, password: string, name: string): Promise<User> => {
        await delay(500);
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

        if (users.find((u: any) => u.email === email)) {
            throw new Error('User already exists');
        }

        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name,
            role: 'user',
            joinedAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        return newUser;
    },

    logout: async () => {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    getCurrentUser: (): User | null => {
        const stored = localStorage.getItem(CURRENT_USER_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    // --- Admin ---
    getAllUsers: async (): Promise<User[]> => {
        await delay(300);
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        // Ensure admin is in the list for display if not saved
        return [INITIAL_ADMIN, ...users.filter((u: User) => u.email !== INITIAL_ADMIN.email)];
    },

    // --- Projects ---
    saveProject: async (project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
        await delay(400);
        const projects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
        const newProject: Project = {
            ...project,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
        };
        projects.push(newProject);
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
        return newProject;
    },

    getUserProjects: async (userId: string): Promise<Project[]> => {
        await delay(300);
        // In this mock, we just return all projects for now as we didn't link them strictly to IDs in this basic schema
        // But let's pretend we filter
        const projects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
        return projects;
    }
};
