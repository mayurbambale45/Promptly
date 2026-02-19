import React, { useEffect, useState } from 'react';
import { AppState, ClarifyingQuestion } from '../../types';
import { geminiService } from '../../services/geminiService';
import { Button } from '../ui/Button';
import { MessageSquare, Wand2, BrainCircuit, CheckCircle2 } from 'lucide-react';

interface Stage2Props {
    state: AppState;
    onAnswer: (questionId: string, answer: string) => void;
    onNext: () => void;
}

export const Stage2_Clarification: React.FC<Stage2Props> = ({ state, onAnswer, onNext }) => {
    const [questions, setQuestions] = useState<ClarifyingQuestion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            const qs = await geminiService.generateQuestions(state.domain as any, state.idea, state.language);
            setQuestions(qs);
            setLoading(false);
        };
        fetchQuestions();
    }, [state.domain, state.idea, state.language]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] animate-in fade-in zoom-in duration-1000">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                    <BrainCircuit className="h-24 w-24 text-blue-600 animate-spin-slow relative z-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">Synthesizing Context...</h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-md text-center">
                    Our AI Consultant is analyzing industry standards for <span className="text-blue-600 font-bold">{state.domain}</span> to refine your scope.
                </p>
            </div>
        );
    }

    const allAnswered = questions.every(q => state.clarificationAnswers[q.id]);

    return (
        <div className="flex flex-col lg:flex-row h-full w-full max-w-7xl mx-auto gap-12 animate-in slide-in-from-bottom-10 duration-700">

            {/* Left Panel: Agent Persona */}
            <div className="lg:w-2/5 bg-slate-900 rounded-[2.5rem] p-10 flex flex-col shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500"></div>

                <div className="flex items-center space-x-4 mb-10">
                    <div className="bg-blue-600/20 p-4 rounded-2xl border border-blue-500/30">
                        <MessageSquare size={32} className="text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-wider">Expert Context</h3>
                        <p className="text-xs font-bold text-blue-400 tracking-[0.2em] uppercase">Phase 02: Refinement</p>
                    </div>
                </div>

                <div className="flex-1 space-y-8 relative z-10">
                    <p className="text-2xl font-medium text-slate-300 leading-snug">
                        "To architect a precise <span className="text-white font-bold italic">{state.subDomain || 'solution'}</span>, I need to align these core technical parameters."
                    </p>

                    <div className="p-6 bg-slate-800/50 rounded-3xl border border-slate-700/50">
                        <p className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest">Requirement Progress</p>
                        <div className="h-4 bg-slate-950 rounded-full overflow-hidden p-1">
                            <div
                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${(Object.keys(state.clarificationAnswers).length / questions.length) * 100}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-3">
                            <span className="text-xs font-black text-slate-500 uppercase">{Object.keys(state.clarificationAnswers).length} Synthesized</span>
                            <span className="text-xs font-black text-blue-400 uppercase">{questions.length} Total</span>
                        </div>
                    </div>
                </div>

                {/* Decorative background blobs */}
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] group-hover:bg-blue-600/20 transition-all duration-700"></div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Right Panel: Questions Form */}
            <div className="lg:w-3/5 flex flex-col">
                <div className="space-y-10">
                    {questions.map((q, index) => (
                        <div key={q.id} className="animate-in slide-in-from-right duration-700" style={{ animationDelay: `${index * 150}ms` }}>
                            <div className="flex items-start space-x-5 mb-6">
                                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
                                    0{index + 1}
                                </span>
                                <h4 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                                    {q.text}
                                </h4>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-4 pl-12">
                                {q.options.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => onAnswer(q.id, opt)}
                                        className={`px-6 py-3 rounded-2xl text-sm font-black tracking-wide transition-all border-2 ${state.clarificationAnswers[q.id] === opt
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/30 -translate-y-1'
                                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                                <div className="w-full mt-2">
                                    <input
                                        type="text"
                                        placeholder="Add specific detail..."
                                        value={state.clarificationAnswers[q.id] === q.options.find(o => o === state.clarificationAnswers[q.id]) ? '' : state.clarificationAnswers[q.id] || ''}
                                        onChange={(e) => onAnswer(q.id, e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-white font-medium focus:border-blue-500 focus:ring-0 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 flex justify-end">
                    <Button
                        onClick={onNext}
                        size="lg"
                        disabled={!allAnswered}
                        className="w-full md:w-auto h-16 px-12 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                        Construct Blueprint
                        <CheckCircle2 size={20} className="ml-3" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
