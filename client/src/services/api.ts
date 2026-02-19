const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
    // Auth
    register: async (user: any) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        if (!res.ok) throw new Error((await res.json()).error);
        return res.json();
    },

    login: async (creds: any) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(creds)
        });
        if (!res.ok) throw new Error((await res.json()).error);
        return res.json();
    },

    // AI
    generateBlueprint: async (data: any) => {
        const res = await fetch(`${API_URL}/ai/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('AI Generation failed');
        return res.json();
    },

    // Projects
    getProjects: async (userId: string) => {
        const res = await fetch(`${API_URL}/projects/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
    },

    saveProject: async (data: any) => {
        const res = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to save project');
        return res.json();
    }
};
