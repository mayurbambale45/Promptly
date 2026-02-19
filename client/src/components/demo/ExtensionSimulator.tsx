import React, { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface ExtensionSimulatorProps {
    onOpenExtension: () => void;
    injectedPrompt: string | null;
}

export const ExtensionSimulator: React.FC<ExtensionSimulatorProps> = ({ onOpenExtension, injectedPrompt }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! How can I help you today?' }
    ]);

    // Update input if prompt is injected
    React.useEffect(() => {
        if (injectedPrompt) {
            setInput(injectedPrompt);
        }
    }, [injectedPrompt]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: 'user', content: input }]);
        setInput('');
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: 'I am a simulated AI. I received your optimized prompt! This proves the middleware works.' }]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-r border-slate-200 dark:border-slate-800 relative overflow-hidden transition-all duration-500">

            {/* Mock Header */}
            <div className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 justify-between">
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 font-bold">
                    <span>GenericLLM 4.0</span>
                </div>
                <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Simulated External Tool</div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-indigo-500' : 'bg-green-600'}`}>
                                {m.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                            </div>
                            <div className={`p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'}`}>
                                {m.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Message GenericLLM..."
                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 outline-none"
                    />
                    {/* The Promptly Trigger Button */}
                    <button
                        onClick={onOpenExtension}
                        className="absolute right-12 top-1/2 -translate-y-1/2 p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group"
                        title="Optimize with Promptly"
                    >
                        <Sparkles size={20} className="animate-pulse" />
                        <span className="absolute bottom-full mb-2 right-0 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">Refine Prompt</span>
                    </button>
                    <button
                        onClick={handleSend}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">
                    Demonstration Mode: Click the Sparkles icon to use the Middleware.
                </p>
            </div>
        </div>
    );
};
