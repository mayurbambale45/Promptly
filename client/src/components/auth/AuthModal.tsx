import React, { useState } from 'react';
import { X, User as UserIcon, Shield, Lock, Mail, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { api } from '../../services/api';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (user: any) => void;
    defaultMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, defaultMode = 'login' }) => {
    const [mode, setMode] = useState(defaultMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let user;
            if (mode === 'login') {
                const res = await api.login({ email, password });
                user = res.user;
                localStorage.setItem('promptly_token', res.token);
                localStorage.setItem('promptly_user', JSON.stringify(user));
            } else {
                const res = await api.register({ email, password, name });
                user = res.user;
                localStorage.setItem('promptly_token', res.token);
                localStorage.setItem('promptly_user', JSON.stringify(user));
            }
            onLogin(user);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg p-10 md:p-14 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">

                {/* Decorative background blob */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center mb-10">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-5 rounded-[2rem] mb-6 shadow-xl shadow-blue-500/20">
                        <Shield size={40} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {mode === 'login' ? 'Nexus Authentication' : 'Create Global Identity'}
                    </h2>
                    <p className="text-slate-500 font-medium mt-2">Access the Enterprise Prompt Engine</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    {mode === 'signup' && (
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Legal Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:border-blue-500 outline-none font-bold"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Identity Endpoint (Email)</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                required
                                className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:border-blue-500 outline-none font-bold"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Secure Passkey</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                required
                                className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:border-blue-500 outline-none font-bold"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
                            <p className="text-red-600 dark:text-red-400 text-sm font-bold text-center">Verification Failed: {error}</p>
                        </div>
                    )}

                    <Button type="submit" className="w-full h-16 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-blue-500/30 bg-gradient-to-r from-blue-600 to-indigo-600" isLoading={loading}>
                        {mode === 'login' ? 'Authorize Session' : 'Provision Account'}
                        <ChevronRight size={20} className="ml-2" />
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    {mode === 'login' ? (
                        <p className="text-sm font-bold text-slate-500">
                            New to the infrastructure?{' '}
                            <button
                                onClick={() => setMode('signup')}
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Request Access
                            </button>
                        </p>
                    ) : (
                        <p className="text-sm font-bold text-slate-500">
                            Existing protocol member?{' '}
                            <button
                                onClick={() => setMode('login')}
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Return to Terminal
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
