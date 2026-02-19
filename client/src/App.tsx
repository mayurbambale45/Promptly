import React, { useState, useEffect } from 'react';
import { AppState, Domain, LANGUAGES } from './types';
import { translations } from './utils/translations';
import { Stage1_Intake } from './components/stages/Stage1_Intake';
import { Stage2_Clarification } from './components/stages/Stage2_Clarification';
import { Stage3_Dashboard } from './components/stages/Stage3_Dashboard';
import { ProjectHistory } from './components/stages/ProjectHistory';
import { RoleSelection } from './components/auth/RoleSelection';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { ThemeToggle } from './components/layout/ThemeToggle';
import { Button } from './components/ui/Button';
import { ExtensionSimulator } from './components/demo/ExtensionSimulator';
import { Sparkles, UserCircle, LogOut, Layout, Zap, Shield, Search, Terminal, History, Database, ArrowRight, Construction } from 'lucide-react';

export const App = () => {
    const [state, setState] = useState<AppState>({
        currentStage: 0,
        user: null,
        selectedRole: null,
        language: 'English',
        theme: 'light',
        domain: '',
        subDomain: '',
        idea: '',
        clarificationAnswers: {},
        projects: []
    });

    const [authOpen, setAuthOpen] = useState(false);
    const [demoMode, setDemoMode] = useState(false);
    const [extensionOpen, setExtensionOpen] = useState(false);
    const [demoPrompt, setDemoPrompt] = useState<string | null>(null);

    // Initialize Theme
    useEffect(() => {
        const root = window.document.documentElement;
        if (state.theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [state.theme]);

    // Auth & Storage Init
    useEffect(() => {
        const storedUser = localStorage.getItem('promptly_user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setState(s => ({ ...s, user, selectedRole: user.role }));
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem('promptly_user');
            }
        }
    }, []);

    const handleRoleSelect = (role: 'user' | 'admin') => {
        if (role === 'admin') {
            if (state.user?.role === 'admin') {
                setState(s => ({ ...s, selectedRole: 'admin', currentStage: 99 }));
            } else {
                setState(s => ({ ...s, selectedRole: 'admin' }));
                setAuthOpen(true);
            }
        } else {
            if (state.user) {
                setState(s => ({ ...s, selectedRole: 'user', currentStage: 1 }));
            } else {
                setState(s => ({ ...s, selectedRole: 'user' }));
                setAuthOpen(true);
            }
        }
    };

    const handleAuthSuccess = (user: any) => {
        setState(s => ({
            ...s,
            user,
            currentStage: user.role === 'admin' ? 99 : 1
        }));
    };

    const handleLogout = async () => {
        localStorage.removeItem('promptly_token');
        localStorage.removeItem('promptly_user');
        setState(s => ({ ...s, user: null, currentStage: 0, selectedRole: null }));
    };

    const resetHome = () => {
        setState(s => ({
            ...s,
            currentStage: 0,
            selectedRole: null,
            domain: '',
            subDomain: '',
            idea: '',
            clarificationAnswers: {}
        }));
    };

    const t = translations[state.language] || translations['English'];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans text-slate-900 dark:text-slate-100 flex flex-col overflow-x-hidden">

            {/* Design Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-40">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-cyan-500 rounded-full blur-[100px]"></div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <button
                        onClick={resetHome}
                        className="flex items-center space-x-3 hover:opacity-90 transition-all group"
                    >
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Sparkles size={22} className="text-white" />
                        </div>
                        <div className="flex flex-col items-start leading-none">
                            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500">Promptly</span>
                            <span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-1">Enterprise AI Architect</span>
                        </div>
                    </button>

                    <nav className="hidden lg:flex items-center space-x-8 text-sm font-black uppercase tracking-widest text-slate-400">
                        <button onClick={resetHome} className={`hover:text-blue-600 transition-colors ${state.currentStage === 0 ? 'text-blue-600' : ''}`}>Workspace</button>
                        <button onClick={() => setState(s => ({ ...s, currentStage: 11 }))} className={`hover:text-blue-600 transition-colors ${state.currentStage === 11 ? 'text-blue-600' : ''}`}>Solutions</button>
                        <button onClick={() => setState(s => ({ ...s, currentStage: 12 }))} className={`hover:text-blue-600 transition-colors ${state.currentStage === 12 ? 'text-blue-600' : ''}`}>Pricing</button>
                    </nav>

                    <div className="flex items-center space-x-5">
                        {state.user && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setState(s => ({ ...s, currentStage: 10 }))}
                                className={`hidden sm:flex rounded-full px-4 border ${state.currentStage === 10 ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-slate-200 dark:border-slate-800'}`}
                            >
                                <History size={18} className="mr-2" />
                                Archive
                            </Button>
                        )}

                        <ThemeToggle
                            theme={state.theme}
                            onToggle={() => setState(s => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }))}
                        />

                        {state.user ? (
                            <div className="flex items-center space-x-4 pl-5 border-l border-slate-200 dark:border-slate-800">
                                <Button
                                    variant={demoMode ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setDemoMode(!demoMode)}
                                    className="hidden md:flex rounded-full px-5 border border-slate-200 dark:border-slate-800"
                                >
                                    <Terminal size={16} className="mr-2" />
                                    Simulator
                                </Button>
                                <div className="text-right hidden sm:block leading-tight">
                                    <p className="text-[10px] uppercase font-black text-slate-400">Node Online</p>
                                    <p className="text-sm font-black text-blue-600 dark:text-blue-400">{state.user.name.split(' ')[0]}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <LogOut size={18} />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex space-x-3">
                                <Button variant="ghost" size="sm" onClick={() => setAuthOpen(true)} className="rounded-full px-6 font-bold uppercase tracking-widest text-xs">
                                    {t['login']}
                                </Button>
                                <Button variant="primary" size="sm" onClick={() => setAuthOpen(true)} className="rounded-full px-6 font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/25">
                                    {t['signup']}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-6 py-12 relative">
                <AuthModal
                    isOpen={authOpen}
                    onClose={() => setAuthOpen(false)}
                    onLogin={handleAuthSuccess}
                />

                {demoMode ? (
                    <div className="flex h-[80vh] w-full border-2 border-slate-100 dark:border-slate-800/60 rounded-[2.5rem] overflow-hidden shadow-2xl relative bg-white dark:bg-slate-950">
                        <div className={`transition-all duration-700 ${extensionOpen ? 'w-2/3' : 'w-full'} h-full`}>
                            <ExtensionSimulator
                                onOpenExtension={() => setExtensionOpen(true)}
                                injectedPrompt={demoPrompt}
                            />
                        </div>

                        <div className={`absolute right-0 top-0 bottom-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-700 ease-in-out ${extensionOpen ? 'translate-x-0' : 'translate-x-full'} w-1/3 min-w-[450px] overflow-y-auto z-20`}>
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-950/50 sticky top-0 z-10">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                                    <span className="font-black text-xs uppercase tracking-[0.2em] text-slate-500">Encrypted Workspace</span>
                                </div>
                                <button onClick={() => setExtensionOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-90"><LogOut size={18} className="rotate-180" /></button>
                            </div>
                            <div className="p-8">
                                {state.currentStage === 0 && <RoleSelection language={state.language} onSelect={handleRoleSelect} />}
                                {state.currentStage === 1 && (
                                    <Stage1_Intake
                                        language={state.language}
                                        domain={state.domain}
                                        subDomain={state.subDomain}
                                        idea={state.idea}
                                        setDomain={(d) => setState(s => ({ ...s, domain: d }))}
                                        setSubDomain={(sd) => setState(s => ({ ...s, subDomain: sd }))}
                                        setIdea={(i) => setState(s => ({ ...s, idea: i }))}
                                        onNext={() => setState(s => ({ ...s, currentStage: 2 }))}
                                    />
                                )}
                                {state.currentStage === 2 && (
                                    <Stage2_Clarification
                                        state={state}
                                        onAnswer={(qid, ans) => setState(s => ({ ...s, clarificationAnswers: { ...s.clarificationAnswers, [qid]: ans } }))}
                                        onNext={() => setState(s => ({ ...s, currentStage: 3 }))}
                                    />
                                )}
                                {state.currentStage === 3 && (
                                    <div className="space-y-8">
                                        <Button className="w-full h-16 rounded-2xl font-black uppercase tracking-widest bg-gradient-to-r from-blue-600 to-indigo-600 border-none shadow-2xl shadow-blue-500/30" onClick={() => {
                                            setDemoPrompt("Act as a Senior Architect... [Optimized Blueprint Injected]");
                                            setExtensionOpen(false);
                                        }}>
                                            Inject Blueprint into Chat
                                        </Button>
                                        <Stage3_Dashboard state={state} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div key={state.currentStage} className="transition-all duration-700 ease-in-out">
                        {state.currentStage === 0 && (
                            <div className="max-w-5xl mx-auto space-y-24">
                                <RoleSelection language={state.language} onSelect={handleRoleSelect} />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                                    {[
                                        { icon: Shield, title: 'Identity Protection', desc: 'Securely manage your intellectual property with enterprise-grade encryption.' },
                                        { icon: Database, title: 'Knowledge Graphs', desc: 'AI models trained on millions of documentation pages across 8 industry sectors.' },
                                        { icon: Sparkles, title: 'Neural Synthesis', desc: 'Advanced reasoning agents that think before they architect your solution.' }
                                    ].map((f, i) => (
                                        <div key={i} className="group p-8 bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-[2rem] hover:border-blue-500/30 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 dark:shadow-none">
                                            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                                                <f.icon size={28} />
                                            </div>
                                            <h3 className="font-black text-lg uppercase tracking-tight mb-3 dark:text-white">{f.title}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{f.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {state.currentStage === 99 && (
                            <AdminDashboard language={state.language} />
                        )}

                        {state.currentStage === 1 && (
                            <div className="max-w-5xl mx-auto">
                                <Stage1_Intake
                                    language={state.language}
                                    domain={state.domain}
                                    subDomain={state.subDomain}
                                    idea={state.idea}
                                    setDomain={(d) => setState(s => ({ ...s, domain: d }))}
                                    setSubDomain={(sd) => setState(s => ({ ...s, subDomain: sd }))}
                                    setIdea={(i) => setState(s => ({ ...s, idea: i }))}
                                    onNext={() => setState(s => ({ ...s, currentStage: 2 }))}
                                />
                            </div>
                        )}

                        {state.currentStage === 2 && (
                            <div className="max-w-7xl mx-auto">
                                <Stage2_Clarification
                                    state={state}
                                    onAnswer={(qid, ans) => setState(s => ({ ...s, clarificationAnswers: { ...s.clarificationAnswers, [qid]: ans } }))}
                                    onNext={() => setState(s => ({ ...s, currentStage: 3 }))}
                                />
                            </div>
                        )}

                        {state.currentStage === 3 && (
                            <div className="max-w-full mx-auto">
                                <Stage3_Dashboard state={state} />
                            </div>
                        )}

                        {state.currentStage === 10 && state.user && (
                            <div className="max-w-5xl mx-auto">
                                <ProjectHistory
                                    userId={state.user.id}
                                    onViewProject={(p) => setState(s => ({
                                        ...s,
                                        idea: p.idea,
                                        domain: p.domain as Domain,
                                        currentStage: 3,
                                    }))}
                                />
                            </div>
                        )}

                        {/* Solutions View */}
                        {state.currentStage === 11 && (
                            <div className="max-w-5xl mx-auto text-center p-20 animate-in fade-in zoom-in duration-500">
                                <Construction size={64} className="mx-auto text-blue-600 mb-8" />
                                <h2 className="text-5xl font-black mb-4">Vertical Solutions</h2>
                                <p className="text-xl text-slate-500 max-w-2xl mx-auto">We are building specialized synthesis engines for FinTech, Healthcare, and Legal departments. Stay tuned for the global rollout.</p>
                                <Button className="mt-10 rounded-full" onClick={resetHome}>Return to Workspace</Button>
                            </div>
                        )}

                        {/* Pricing View */}
                        {state.currentStage === 12 && (
                            <div className="max-w-7xl mx-auto p-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
                                <h2 className="text-5xl font-black text-center mb-16">Global <span className="text-blue-600">Pricing</span> Architect</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[
                                        { name: 'Core', price: 'Free', features: ['3 Blueprints / Mo', 'Standard Nodes', 'Public Archive'] },
                                        { name: 'Enterprise', price: '$49', features: ['Unlimited Blueprints', 'Deep Reason Engine', 'Private IP Guard', 'Priority Support'], popular: true },
                                        { name: 'Nexus', price: 'Custom', features: ['Dedicated Server', 'Custom Training', 'On-Premise Option', 'API Access'] }
                                    ].map((plan, i) => (
                                        <div key={i} className={`p-10 rounded-[2.5rem] border-2 ${plan.popular ? 'border-blue-600 shadow-2xl shadow-blue-500/20' : 'border-slate-100 dark:border-slate-800'} bg-white dark:bg-slate-900`}>
                                            <h3 className="font-black text-2xl mb-2">{plan.name}</h3>
                                            <div className="text-4xl font-black mb-8">{plan.price}<span className="text-sm text-slate-400">/mo</span></div>
                                            <ul className="space-y-4 mb-10">
                                                {plan.features.map((f, j) => (
                                                    <li key={j} className="flex items-center text-slate-500 font-bold">
                                                        <Zap size={16} className="text-blue-600 mr-2" /> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button variant={plan.popular ? 'primary' : 'outline'} className="w-full rounded-2xl" onClick={() => setAuthOpen(true)}>Initialize Plan</Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-900 bg-white/50 dark:bg-slate-950/50 py-16 backdrop-blur-md">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="flex items-center space-x-3 opacity-80">
                            <Sparkles size={24} className="text-blue-600" />
                            <span className="font-black text-xl uppercase tracking-widest italic">Promptly Architecture</span>
                        </div>
                        <p className="max-w-md text-slate-500 font-medium leading-relaxed">
                            The world's most advanced prompt engineering and project architecture platform for high-performance teams.
                        </p>
                        <div className="flex space-x-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900"></div>
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900"></div>
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900"></div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-6">Protocol</h4>
                        <ul className="space-y-4 text-sm font-bold text-slate-500">
                            <li><a href="#" className="hover:text-blue-600 transition-all">Documentation</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-all">API Access</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-all">Node Health</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-6">Legal Control</h4>
                        <ul className="space-y-4 text-sm font-bold text-slate-500">
                            <li><a href="#" className="hover:text-blue-600 transition-all">Privacy Shield</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-all">Service Clauses</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-all">GDPR Map</a></li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-6 mt-16 pt-8 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">© 2026 Promptly Research Group.</p>
                    <div className="flex space-x-2 items-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">All Systems Operational</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
