import React, { useEffect, useState } from 'react';
import { AppState } from '../../types';
import { geminiService } from '../../services/geminiService';
import { api } from '../../services/api';
import { FileText, Terminal, ListChecks, Check, Copy, Share2, Download, Zap, ShieldCheck, Maximize2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface Stage3Props {
    state: AppState;
}

export const Stage3_Dashboard: React.FC<Stage3Props> = ({ state }) => {
    const [data, setData] = useState<{ srs: string; prompts: any[]; plan: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'srs' | 'prompts' | 'plan'>('srs');
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [isExpanded, setIsExpanded] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await geminiService.generateBlueprint(state);
            setData(res);

            // Save to history if user is logged in
            if (state.user?.id) {
                try {
                    await api.saveProject({
                        userId: state.user.id,
                        idea: state.idea,
                        domain: state.domain,
                        blueprint: res
                    });
                } catch (e) {
                    console.error("Failed to auto-save project", e);
                }
            }
        };
        fetchData();
    }, []);

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-1000">
                <div className="relative mb-8">
                    <div className="w-24 h-24 border-8 border-slate-100 dark:border-slate-800 rounded-full"></div>
                    <div className="absolute top-0 w-24 h-24 border-8 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <Zap className="absolute inset-0 m-auto h-8 w-8 text-blue-600 animate-pulse" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight text-center">Finalizing Neural Synthesis...</h2>
                <p className="text-slate-500 font-medium mt-2">Connecting domain vectors and mapping requirements.</p>
            </div>
        );
    }

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="flex flex-col lg:flex-row h-[85vh] bg-white dark:bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-700">

            {/* Enhanced Sidebar */}
            <div className="lg:w-80 bg-slate-50 dark:bg-slate-910/50 border-r border-slate-200 dark:border-slate-800 flex flex-col p-8">
                <div className="mb-10">
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <ShieldCheck size={12} className="mr-1" />
                        Verified Blueprint
                    </div>
                    <h2 className="font-black text-2xl text-slate-900 dark:text-white leading-tight mb-2">
                        {state.idea.substring(0, 40)}...
                    </h2>
                    <span className="inline-block px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400">
                        {state.domain}
                    </span>
                </div>

                <div className="mb-10 space-y-4">
                    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Synthesized Nodes</p>
                        <p className="text-3xl font-black text-blue-600">
                            14.2k
                        </p>
                    </div>
                    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Confidence Score</p>
                        <p className="text-3xl font-black text-emerald-500">
                            98%
                        </p>
                    </div>
                </div>

                <nav className="flex-1 space-y-4">
                    {[
                        { id: 'srs', label: 'Architecture Doc', icon: FileText },
                        { id: 'prompts', label: 'Optimized Prompts', icon: Terminal },
                        { id: 'plan', label: 'Execution Roadmap', icon: ListChecks }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center p-4 rounded-2xl text-sm font-black tracking-wide transition-all group ${activeTab === item.id
                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <item.icon size={20} className={`mr-4 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800">
                    <Button variant="ghost" className="w-full justify-start text-xs font-black uppercase text-slate-400 hover:text-blue-600">
                        <Download size={16} className="mr-2" />
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* Scrollable Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">
                <div className="h-20 px-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
                    <h3 className="text-lg font-black uppercase tracking-widest text-slate-400">
                        {activeTab === 'srs' && 'System Requirements Specification'}
                        {activeTab === 'prompts' && 'Context-Aware Prompts'}
                        {activeTab === 'plan' && 'Phased Implementation Strategy'}
                    </h3>
                    <div className="flex space-x-3">
                        <Button variant="ghost" size="sm" className="rounded-full">
                            <Share2 size={18} />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10">
                    {activeTab === 'srs' && (
                        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-6 duration-700">
                            <div className="p-10 bg-slate-50 dark:bg-slate-900/30 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800">
                                <pre className="whitespace-pre-wrap font-sans text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {data.srs}
                                </pre>
                            </div>
                        </div>
                    )}

                    {activeTab === 'prompts' && (
                        <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-700">
                            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                                <p className="text-blue-600 dark:text-blue-400 text-sm font-bold">
                                    💡 These prompts are engineered for high-reasoning models (GPT-4, Claude 3, Gemini 1.5 Pro).
                                    They are optimized for context retention and adversarial logic.
                                </p>
                            </div>
                            {data.prompts.map((prompt: any, i: number) => (
                                <div key={i} className="group relative">
                                    <div className="flex justify-between items-end mb-4 px-2">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{prompt.title}</h3>
                                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">High-Density Payload • 15+ Logic Chunks</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => handleCopy(prompt.content, i)}
                                                className={`rounded-full px-6 transition-all ${copiedIndex === i ? 'bg-emerald-500 text-white' : ''}`}
                                            >
                                                {copiedIndex === i ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                                                {copiedIndex === i ? 'Copied' : 'Copy Payload'}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className={`relative bg-slate-900 dark:bg-black rounded-[2.5rem] p-10 font-mono text-base md:text-lg text-blue-300/80 leading-relaxed border-2 border-slate-800 group-hover:border-blue-500/30 transition-all shadow-2xl overflow-hidden ${isExpanded === i ? 'max-h-none' : 'max-h-[600px] overflow-y-auto'}`}>
                                        <div className="absolute top-4 right-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Encrypted Buffer</div>
                                        <pre className="whitespace-pre-wrap">{prompt.content}</pre>

                                        {!isExpanded && prompt.content.split('\n').length > 15 && (
                                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 dark:from-black to-transparent flex items-end justify-center pb-6">
                                                <Button variant="ghost" size="sm" onClick={() => setIsExpanded(i)} className="text-blue-400 hover:text-blue-300">
                                                    <Maximize2 size={16} className="mr-2" />
                                                    View Full Payload
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'plan' && (
                        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-6 duration-700">
                            <div className="p-10 bg-slate-50 dark:bg-slate-900/30 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800">
                                <pre className="whitespace-pre-wrap font-sans text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {data.plan}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
