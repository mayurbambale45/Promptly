import React from 'react';
import { User, Shield, ArrowRight, Zap, Database } from 'lucide-react';
import { translations } from '../../utils/translations';

interface RoleSelectionProps {
    onSelect: (role: 'user' | 'admin') => void;
    language: string;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect, language }) => {
    const t = translations[language] || translations['English'];

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-700">
            <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100 dark:border-blue-800">
                    <Zap size={14} className="fill-current" />
                    <span>Identity Verification Required</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                    Select Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">Access Tier</span>
                </h1>
                <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
                    Choose the protocol layer level to begin your architectural discovery process.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-6">
                {/* User Card */}
                <button
                    onClick={() => onSelect('user')}
                    className="group relative p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 text-left"
                >
                    <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-500 text-white">
                        <ArrowRight size={24} />
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                        <User size={32} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight lowercase first-letter:uppercase">
                        Architect
                    </h3>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Design solutions, refine requirements, and generate high-fidelity blueprints for personal or client projects.
                    </p>
                    <div className="mt-8 flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
                        <span>Standard Protocol</span>
                        <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                        <span>Fully Functional</span>
                    </div>
                </button>

                {/* Admin Card */}
                <button
                    onClick={() => onSelect('admin')}
                    className="group relative p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 text-left"
                >
                    <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-500 text-white">
                        <ArrowRight size={24} />
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                        <Database size={32} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight lowercase first-letter:uppercase">
                        Administrator
                    </h3>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Access system telemetry, manage user nodes, and monitor global blueprint generation metrics.
                    </p>
                    <div className="mt-8 flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                        <span>Root Access</span>
                        <div className="w-1 h-1 bg-indigo-600 rounded-full"></div>
                        <span>Tier 1 Security</span>
                    </div>
                </button>
            </div>
        </div>
    );
};
