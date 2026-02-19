import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { FileText, Calendar, ArrowRight, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

interface Project {
    id: string;
    idea: string;
    domain: string;
    createdAt: string;
    blueprint: any;
}

interface ProjectHistoryProps {
    userId: string;
    onViewProject: (project: Project) => void;
}

export const ProjectHistory: React.FC<ProjectHistoryProps> = ({ userId, onViewProject }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await api.getProjects(userId);
                setProjects(data);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [userId]);

    if (loading) return <div className="text-center p-10 font-bold text-slate-400 animate-pulse">Scanning Archive...</div>;

    if (projects.length === 0) {
        return (
            <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No Blueprints Found</h3>
                <p className="text-slate-500 font-medium">Your architectural history is currently empty. Start a new build to see it here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Architectural Archive</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                    <button
                        key={project.id}
                        onClick={() => onViewProject(project)}
                        className="group bg-white dark:bg-slate-900 p-8 rounded-[2rem] border-2 border-slate-50 dark:border-slate-800 hover:border-blue-500 transition-all duration-300 text-left shadow-sm hover:shadow-xl shadow-slate-200/50 dark:shadow-none"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                                <FileText size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 line-clamp-1">
                            {project.idea}
                        </h3>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-6 uppercase tracking-widest">
                            {project.domain}
                        </p>
                        <div className="flex items-center text-sm font-black text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest">
                            Review Specifications
                            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
