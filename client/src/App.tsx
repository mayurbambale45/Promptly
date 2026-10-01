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
import {
    Sparkles, LogOut, Terminal, History, Database, Shield,
    Construction, Zap, Globe, ChevronDown, ArrowRight
} from 'lucide-react';

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
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [demoMode, setDemoMode] = useState(false);
    const [extensionOpen, setExtensionOpen] = useState(false);
    const [demoPrompt, setDemoPrompt] = useState<string | null>(null);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

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
                localStorage.removeItem('promptly_user');
            }
        }
    }, []);

    // Close lang dropdown on outside click
    useEffect(() => {
        const handler = () => setLangDropdownOpen(false);
        if (langDropdownOpen) document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, [langDropdownOpen]);

    const handleRoleSelect = (role: 'user' | 'admin') => {
        if (role === 'admin') {
            if (state.user?.role === 'admin') {
                setState(s => ({ ...s, selectedRole: 'admin', currentStage: 99 }));
            } else {
                setState(s => ({ ...s, selectedRole: 'admin' }));
                setAuthMode('login');
                setAuthOpen(true);
            }
        } else {
            if (state.user) {
                setState(s => ({ ...s, selectedRole: 'user', currentStage: 1 }));
            } else {
                setState(s => ({ ...s, selectedRole: 'user' }));
                setAuthMode('login');
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
        setAuthOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('promptly_token');
        localStorage.removeItem('promptly_user');
        setState(s => ({ ...s, user: null, currentStage: 0, selectedRole: null, domain: '', subDomain: '', idea: '', clarificationAnswers: {} }));
    };

    const resetHome = () => {
        setState(s => ({
            ...s,
            currentStage: s.user ? (s.user.role === 'admin' ? 99 : 1) : 0,
            domain: '',
            subDomain: '',
            idea: '',
            clarificationAnswers: {}
        }));
    };

    const t = translations[state.language] || translations['English'];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans text-slate-900 dark:text-slate-100 flex flex-col overflow-x-hidden">

            {/* Background Design Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-40">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
                <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-cyan-500 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[10%] left-[30%] w-[20%] h-[20%] bg-indigo-500 rounded-full blur-[100px]"></div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
                <div className="container mx-auto px-4 md:px-6 h-18 flex items-center justify-between py-3">
                    <button
                        onClick={() => setState(s => ({ ...s, currentStage: s.user ? (s.user.role === 'admin' ? 99 : 0) : 0, domain: '', subDomain: '', idea: '', clarificationAnswers: {} }))}
                        className="flex items-center space-x-3 hover:opacity-90 transition-all group"
                    >
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div className="flex flex-col items-start leading-none">
                            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500">Promptly</span>
                            <span className="text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-0.5">Enterprise AI Architect</span>
                        </div>
                    </button>

                    <nav className="hidden lg:flex items-center space-x-6 text-xs font-black uppercase tracking-widest text-slate-400">
                        <button
                            onClick={resetHome}
                            className={`hover:text-blue-600 transition-colors ${[0, 1].includes(state.currentStage) ? 'text-blue-600' : ''}`}
                        >
                            Workspace
                        </button>
                        <button
                            onClick={() => setState(s => ({ ...s, currentStage: 11 }))}
                            className={`hover:text-blue-600 transition-colors ${state.currentStage === 11 ? 'text-blue-600' : ''}`}
                        >
                            Solutions
                        </button>
                        <button
                            onClick={() => setState(s => ({ ...s, currentStage: 12 }))}
                            className={`hover:text-blue-600 transition-colors ${state.currentStage === 12 ? 'text-blue-600' : ''}`}
                        >
                            Pricing
                        </button>
                    </nav>

                    <div className="flex items-center space-x-3">
                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setLangDropdownOpen(!langDropdownOpen); }}
                                className="flex items-center space-x-1.5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-bold"
                                title="Change Language"
                            >
                                <Globe size={16} />
                                <span className="hidden md:inline">{state.language.substring(0, 3)}</span>
                                <ChevronDown size={12} />
                            </button>
                            {langDropdownOpen && (
                                <div
                                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto"
                                    onClick={e => e.stopPropagation()}
                                >
                                    {LANGUAGES.map(lang => (
                                        <button
                                            key={lang}
                                            onClick={() => {
                                                setState(s => ({ ...s, language: lang }));
                                                setLangDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${state.language === lang ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-600 dark:text-slate-400'}`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <ThemeToggle
                            theme={state.theme}
                            onToggle={() => setState(s => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }))}
                        />

                        {state.user ? (
                            <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-800">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setState(s => ({ ...s, currentStage: 10 }))}
                                    className={`hidden sm:flex rounded-full px-3 border ${state.currentStage === 10 ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800' : 'border-slate-200 dark:border-slate-800'}`}
                                >
                                    <History size={16} className="mr-1.5" />
                                    Archive
                                </Button>

                                <Button
                                    variant={demoMode ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setDemoMode(!demoMode)}
                                    className="hidden md:flex rounded-full px-3 border border-slate-200 dark:border-slate-800"
                                >
                                    <Terminal size={14} className="mr-1.5" />
                                    Demo
                                </Button>

                                <div className="text-right hidden sm:block leading-tight">
                                    <p className="text-[9px] uppercase font-black text-slate-400">
                                        {state.user.role === 'admin' ? '⚡ Root Access' : '● Node Online'}
                                    </p>
                                    <p className="text-sm font-black text-blue-600 dark:text-blue-400">{state.user.name.split(' ')[0]}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleLogout}
                                    className="rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={16} />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { setAuthMode('login'); setAuthOpen(true); }}
                                    className="rounded-full px-4 font-bold uppercase tracking-widest text-xs"
                                >
                                    {t['login']}
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}
                                    className="rounded-full px-4 font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/25"
                                >
                                    {t['signup']}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 md:px-6 py-10 relative">
                <AuthModal
                    isOpen={authOpen}
                    onClose={() => setAuthOpen(false)}
                    onLogin={handleAuthSuccess}
                    defaultMode={authMode}
                />

                {demoMode && state.user ? (
                    <div className="flex h-[82vh] w-full border-2 border-slate-100 dark:border-slate-800/60 rounded-[2.5rem] overflow-hidden shadow-2xl relative bg-white dark:bg-slate-950">
                        <div className={`transition-all duration-700 ${extensionOpen ? 'w-2/3' : 'w-full'} h-full`}>
                            <ExtensionSimulator
                                onOpenExtension={() => setExtensionOpen(true)}
                                injectedPrompt={demoPrompt}
                            />
                        </div>

                        <div className={`absolute right-0 top-0 bottom-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-700 ease-in-out ${extensionOpen ? 'translate-x-0' : 'translate-x-full'} w-1/3 min-w-[400px] overflow-y-auto z-20`}>
                            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-950/50 sticky top-0 z-10">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                                    <span className="font-black text-xs uppercase tracking-[0.2em] text-slate-500">Encrypted Workspace</span>
                                </div>
                                <button onClick={() => setExtensionOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                                    <LogOut size={16} className="rotate-180" />
                                </button>
                            </div>
                            <div className="p-6">
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
                                    <div className="space-y-6">
                                        <Button
                                            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-gradient-to-r from-blue-600 to-indigo-600 border-none shadow-2xl shadow-blue-500/30"
                                            onClick={() => {
                                                setDemoPrompt("Act as a Senior Architect... [Optimized Blueprint Injected by Promptly]");
                                                setExtensionOpen(false);
                                            }}
                                        >
                                            Inject Blueprint into Chat
                                        </Button>
                                        <Stage3_Dashboard state={state} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div key={state.currentStage} className="transition-all duration-700 ease-in-out animate-in fade-in duration-500">

                        {/* Stage 0: Home / Role Selection */}
                        {state.currentStage === 0 && (
                            <div className="max-w-5xl mx-auto space-y-24">
                                <RoleSelection language={state.language} onSelect={handleRoleSelect} />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                                    {[
                                        { icon: Shield, title: 'Identity Protection', desc: 'Securely manage your intellectual property with enterprise-grade encryption and IP guard protocols.' },
                                        { icon: Database, title: 'Knowledge Graphs', desc: 'AI models trained on millions of documentation pages across 8 industry sectors for domain-specific precision.' },
                                        { icon: Sparkles, title: 'Neural Synthesis', desc: 'Advanced reasoning agents that deeply analyze requirements before architecting your enterprise solution.' }
                                    ].map((f, i) => (
                                        <div key={i} className="group p-8 bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-[2rem] hover:border-blue-500/30 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 dark:shadow-none">
                                            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                                                <f.icon size={26} />
                                            </div>
                                            <h3 className="font-black text-lg uppercase tracking-tight mb-3 dark:text-white">{f.title}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{f.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Admin Dashboard */}
                        {state.currentStage === 99 && (
                            <AdminDashboard language={state.language} />
                        )}

                        {/* Stage 1: Idea Intake */}
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

                        {/* Stage 2: Clarification */}
                        {state.currentStage === 2 && (
                            <div className="max-w-7xl mx-auto">
                                <Stage2_Clarification
                                    state={state}
                                    onAnswer={(qid, ans) => setState(s => ({ ...s, clarificationAnswers: { ...s.clarificationAnswers, [qid]: ans } }))}
                                    onNext={() => setState(s => ({ ...s, currentStage: 3 }))}
                                />
                            </div>
                        )}

                        {/* Stage 3: Blueprint Dashboard */}
                        {state.currentStage === 3 && (
                            <div className="max-w-full mx-auto">
                                <Stage3_Dashboard state={state} />
                            </div>
                        )}

                        {/* Project Archive */}
                        {state.currentStage === 10 && state.user && (
                            <div className="max-w-5xl mx-auto">
                                <ProjectHistory
                                    userId={state.user.id}
                                    onViewProject={(p) => setState(s => ({
                                        ...s,
                                        idea: p.idea,
                                        domain: p.domain as Domain,
                                        subDomain: p.subDomain || '',
                                        currentStage: 3,
                                    }))}
                                />
                            </div>
                        )}

                        {/* Solutions Page */}
                        {state.currentStage === 11 && (
                            <div className="max-w-5xl mx-auto text-center p-16 animate-in fade-in zoom-in duration-500">
                                <Construction size={56} className="mx-auto text-blue-600 mb-8" />
                                <h2 className="text-5xl font-black mb-4">Vertical Solutions</h2>
                                <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
                                    We are building specialized synthesis engines for FinTech, Healthcare, and Legal departments. Stay tuned for the global rollout.
                                </p>
                                <Button className="rounded-full px-8" onClick={resetHome}>
                                    Return to Workspace
                                    <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </div>
                        )}

                        {/* Pricing Page */}
                        {state.currentStage === 12 && (
                            <div className="max-w-7xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                                <div className="text-center mb-16">
                                    <h2 className="text-5xl font-black mb-4">
                                        Global <span className="text-blue-600">Pricing</span> Architect
                                    </h2>
                                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
                                        Choose the protocol that matches your ambition.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[
                                        {
                                            name: 'Core',
                                            price: 'Free',
                                            description: 'Perfect for individual projects and exploration.',
                                            features: ['3 Blueprints / Month', 'Standard Domain Access', 'Public Archive (7 days)', 'Community Support'],
                                        },
                                        {
                                            name: 'Enterprise',
                                            price: '$49',
                                            description: 'For professional teams and power users.',
                                            features: ['Unlimited Blueprints', 'Deep Reason Engine', 'Private IP Guard', 'Priority Support', 'Team Collaboration', 'API Access'],
                                            popular: true
                                        },
                                        {
                                            name: 'Nexus',
                                            price: 'Custom',
                                            description: 'Enterprise-grade dedicated infrastructure.',
                                            features: ['Dedicated Server', 'Custom AI Training', 'On-Premise Option', 'White-Label Solution', 'SLA Guarantee', '24/7 Support']
                                        }
                                    ].map((plan, i) => (
                                        <div key={i} className={`p-10 rounded-[2.5rem] border-2 ${plan.popular ? 'border-blue-600 shadow-2xl shadow-blue-500/20 relative' : 'border-slate-100 dark:border-slate-800'} bg-white dark:bg-slate-900`}>
                                            {plan.popular && (
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                    Most Popular
                                                </div>
                                            )}
                                            <h3 className="font-black text-2xl mb-1">{plan.name}</h3>
                                            <p className="text-slate-500 text-sm font-medium mb-6">{plan.description}</p>
                                            <div className="text-4xl font-black mb-8">
                                                {plan.price}
                                                {plan.price !== 'Free' && plan.price !== 'Custom' && <span className="text-sm text-slate-400 font-normal">/mo</span>}
                                            </div>
                                            <ul className="space-y-3 mb-10">
                                                {plan.features.map((f, j) => (
                                                    <li key={j} className="flex items-center text-slate-500 dark:text-slate-400 font-medium">
                                                        <Zap size={14} className="text-blue-600 mr-2.5 flex-shrink-0" /> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button
                                                variant={plan.popular ? 'primary' : 'outline'}
                                                className="w-full rounded-2xl"
                                                onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}
                                            >
                                                Initialize Plan
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-900 bg-white/50 dark:bg-slate-950/50 py-14 backdrop-blur-md mt-auto">
                <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="col-span-1 md:col-span-2 space-y-5">
                        <div className="flex items-center space-x-2.5 opacity-80">
                            <Sparkles size={22} className="text-blue-600" />
                            <span className="font-black text-lg uppercase tracking-widest">Promptly Architecture</span>
                        </div>
                        <p className="max-w-md text-slate-500 font-medium leading-relaxed text-sm">
                            The world's most advanced AI prompt engineering and project architecture platform for high-performance enterprise teams.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-5">Protocol</h4>
                        <ul className="space-y-3 text-sm font-bold text-slate-500">
                            <li><a href="#" className="hover:text-blue-600 transition-all">Documentation</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-all">API Access</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-all">Node Health</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-5">Legal Control</h4>
                        <ul className="space-y-3 text-sm font-bold text-slate-500">
                            <li><a href="#" className="hover:text-blue-600 transition-all">Privacy Shield</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-all">Service Clauses</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition-all">GDPR Map</a></li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-4 md:px-6 mt-12 pt-6 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">© 2026 Promptly Research Group.</p>
                    <div className="flex space-x-1.5 items-center">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">All Systems Operational</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
