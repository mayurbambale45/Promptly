import React, { useEffect, useState } from 'react';
import { mockBackend } from '../../services/mockBackend';
import { User } from '../../types';
import { Trash2, Search, Download, Filter, BarChart3, Users, Layout } from 'lucide-react';
import { translations } from '../../utils/translations';
import { Button } from '../ui/Button';

interface AdminDashboardProps {
    language: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const t = translations[language] || translations['English'];

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const data = await mockBackend.getAllUsers();
        setUsers(data);
        setLoading(false);
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">System Telemetry</h1>
                    <p className="text-lg text-slate-500 font-medium">Enterprise dashboard for node management and blueprint metrics.</p>
                </div>
                <div className="flex space-x-3">
                    <Button variant="secondary" size="sm" className="rounded-xl px-6">
                        <Download size={18} className="mr-2" />
                        Export Audit Log
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Active Sessions', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Engine Load', value: '14%', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: 'Latency (Avg)', value: '840ms', icon: Layout, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { label: 'Node Health', value: 'Optimum', icon: Filter, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border-2 border-slate-50 dark:border-slate-800 shadow-sm group hover:border-blue-500/20 transition-all duration-500">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                            <stat.icon size={24} />
                        </div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</h3>
                        <p className={`text-3xl font-black ${stat.color} tracking-tight`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 shadow-2xl overflow-hidden shadow-slate-200/50 dark:shadow-none">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                    <h2 className="font-black text-2xl text-slate-900 dark:text-white uppercase tracking-tight">Access Control List</h2>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Identify node or identity..."
                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm font-medium">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            <tr>
                                <th className="px-10 py-6">Node Identity</th>
                                <th className="px-10 py-6">Protocol Layer</th>
                                <th className="px-10 py-6">Provisioned At</th>
                                <th className="px-10 py-6 text-right">Interactions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                            {loading ? (
                                <tr><td colSpan={4} className="p-20 text-center font-black uppercase tracking-widest text-slate-300">Synchronizing...</td></tr>
                            ) : users.map((user) => (
                                <tr key={user.id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-300">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg mr-5 shadow-lg shadow-blue-500/20">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 dark:text-white text-base">{user.name}</div>
                                                <div className="text-slate-400 font-bold">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin'
                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-slate-500 dark:text-slate-400 font-bold">
                                        {new Date(user.joinedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
