import React from 'react';
import { Domain } from '../../types';
import { Button } from '../ui/Button';
import { translations } from '../../utils/translations';
import { Lightbulb, Mic, Globe, Sparkle } from 'lucide-react';

interface Stage1Props {
    language: string;
    domain: Domain | '';
    subDomain: string;
    idea: string;
    setDomain: (d: Domain) => void;
    setSubDomain: (s: string) => void;
    setIdea: (i: string) => void;
    onNext: () => void;
}

const DOMAINS: Domain[] = ['Software Engineering', 'Legal', 'Medical', 'Finance', 'Marketing', 'Education', 'Creative Writing', 'Business'];

const SUBDOMAINS: Record<Domain, string[]> = {
    'Software Engineering': ['Web App', 'Mobile App', 'API', 'DevOps Tool', 'Game'],
    'Legal': ['Contract', 'Privacy Policy', 'Terms of Service', 'Legal Notice'],
    'Medical': ['Patient Portal', 'Diagnostic Tool', 'Telehealth', 'Compliance'],
    'Finance': ['Trading Bot', 'Budget Tracker', 'Investment Analysis', 'Banking'],
    'Marketing': ['Ad Campaign', 'Content Strategy', 'SEO Plan', 'Email Sequence'],
    'Education': ['Course Outline', 'Lesson Plan', 'Quiz Generator', 'Study Guide'],
    'Creative Writing': ['Story Plot', 'Character Arc', 'World Building', 'Dialogue'],
    'Business': ['Business Plan', 'Pitch Deck', 'Market Research', 'Operational Strategy']
};

const LAZY_IDEAS: Record<Domain, string[]> = {
    'Software Engineering': ['A task management app for remote teams', 'An e-commerce site for handmade crafts', 'A fitness tracking mobile app'],
    'Legal': ['A standard NDA for freelancers', 'A rental agreement for a house'],
    'Medical': ['A symptom checker for common colds'],
    'Finance': ['A crypto portfolio tracker'],
    'Marketing': ['A viral marketing campaign for a new soda'],
    'Education': ['A math quiz for 5th graders'],
    'Creative Writing': ['A mystery novel set in Victorian London'],
    'Business': ['A startup pitch for a new AI tool']
};

export const Stage1_Intake: React.FC<Stage1Props> = ({
    language, domain, subDomain, idea,
    setDomain, setSubDomain, setIdea, onNext
}) => {
    const t = translations[language] || translations['English'];

    return (
        <div className="w-full max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-700">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl mb-6 shadow-2xl shadow-blue-500/20 text-white transform hover:rotate-6 transition-transform">
                    <Lightbulb size={40} />
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                    {t['describe_idea']}
                </h2>
                <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">
                    Let's begin by defining the scope of your innovation.
                </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-2xl space-y-10">
                {/* Domain Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 ml-1">Domain Architecture</label>
                        <select
                            value={domain}
                            onChange={(e) => {
                                setDomain(e.target.value as Domain);
                                setSubDomain('');
                            }}
                            className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:ring-0 outline-none transition-all font-bold"
                        >
                            <option value="" disabled>Select Core Domain</option>
                            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Specialization</label>
                        <select
                            value={subDomain}
                            onChange={(e) => setSubDomain(e.target.value)}
                            disabled={!domain}
                            className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:ring-0 outline-none transition-all font-bold disabled:opacity-40"
                        >
                            <option value="">Select Category</option>
                            {domain && SUBDOMAINS[domain]?.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                {/* Idea Input */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 ml-1">The Innovation Statement</label>
                        {domain && (
                            <div className="hidden md:flex gap-2">
                                {LAZY_IDEAS[domain]?.slice(0, 2).map((lazyIdea, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setIdea(lazyIdea)}
                                        className="text-[10px] font-bold uppercase tracking-tighter px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                                    >
                                        Template {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="relative group">
                        <textarea
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                            placeholder="Describe your vision in high detail..."
                            className="w-full px-7 py-6 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-0 outline-none min-h-[220px] resize-none text-xl font-medium leading-relaxed transition-all group-hover:bg-slate-50 dark:group-hover:bg-slate-950"
                        />
                        <button className="absolute bottom-6 right-6 p-4 bg-white dark:bg-slate-900 shadow-xl rounded-2xl text-blue-600 dark:text-blue-400 hover:scale-110 active:scale-95 transition-all border border-slate-100 dark:border-slate-800">
                            <Mic size={24} />
                        </button>
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        onClick={onNext}
                        size="lg"
                        className="w-full h-18 rounded-2xl text-xl font-black uppercase tracking-widest shadow-2xl shadow-blue-500/40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-none transition-all active:scale-[0.98]"
                        disabled={!domain || !subDomain || !idea}
                    >
                        <Sparkle size={20} className="mr-3 animate-pulse" />
                        Initiate Deep Synthesis
                    </Button>
                </div>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
                {[
                    { label: 'Latency', val: ' < 800ms' },
                    { label: 'Security', val: 'AES-256' },
                    { label: 'Dataset', val: 'V4.22' },
                    { label: 'Success', val: '99.9%' }
                ].map((stat, i) => (
                    <div key={i} className="text-center">
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">{stat.label}</p>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{stat.val}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
