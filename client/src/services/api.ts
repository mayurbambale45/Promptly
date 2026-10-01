const API_URL = import.meta.env.VITE_API_URL || '/api';

const getToken = () => localStorage.getItem('promptly_token');

const authHeaders = () => ({
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
});

export const api = {
    // Auth
    register: async (user: { email: string; password: string; name: string }) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(user)
        });
        if (!res.ok) throw new Error((await res.json()).error);
        return res.json();
    },

    login: async (creds: { email: string; password: string }) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(creds)
        });
        if (!res.ok) throw new Error((await res.json()).error);
        return res.json();
    },

    // AI
    generateBlueprint: async (data: {
        domain: string;
        idea: string;
        clarificationAnswers: Record<string, string>;
        subDomain: string;
    }) => {
        const res = await fetch(`${API_URL}/ai/generate`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('AI Generation failed');
        return res.json();
    },

    // Projects
    getProjects: async (userId: string) => {
        const res = await fetch(`${API_URL}/projects/${userId}`, {
            headers: authHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
    },

    saveProject: async (data: {
        userId: string;
        idea: string;
        domain: string;
        blueprint: any;
        subDomain?: string;
    }) => {
        const res = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to save project');
        return res.json();
    },

    deleteProject: async (projectId: string) => {
        const res = await fetch(`${API_URL}/projects/${projectId}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete project');
        return res.json();
    },

    // Admin
    getUsers: async () => {
        const res = await fetch(`${API_URL}/users`, {
            headers: authHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
    },

    deleteUser: async (userId: string) => {
        const res = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete user');
        return res.json();
    },

    // Health Check
    healthCheck: async () => {
        const res = await fetch(`${API_URL.replace('/api', '')}/health`);
        return res.ok;
    }
};
