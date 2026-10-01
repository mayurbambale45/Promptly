import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { FileText, Calendar, ArrowRight, Zap, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface Project {
    id: string;
    idea: string;
    domain: string;
    subDomain?: string;
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
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects();
    }, [userId]);

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getProjects(userId);
            // Sort by most recent first
            setProjects(data.sort((a: Project, b: Project) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ));
        } catch (err) {
            setError('Failed to load project history. Check if the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, projectId: string, ideaText: string) => {
        e.stopPropagation(); // Prevent card click
        if (!confirm(`Delete blueprint for "${ideaText.substring(0, 40)}..."? This cannot be undone.`)) return;

        setDeletingId(projectId);
        try {
            await api.deleteProject(projectId);
            setProjects(prev => prev.filter(p => p.id !== projectId));
        } catch (err) {
            setError('Failed to delete project. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return (
        <div className="text-center p-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Scanning Archive...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-red-100 dark:border-red-900">
            <AlertCircle size={40} className="text-red-500 mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-bold text-center">{error}</p>
            <Button onClick={fetchProjects} variant="outline" className="mt-6 rounded-xl" size="sm">Retry</Button>
        </div>
    );

    if (projects.length === 0) {
        return (
            <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="text-slate-300" size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No Blueprints Found</h3>
                <p className="text-slate-500 font-medium">Your architectural history is empty. Start a new build to see it here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Architectural Archive
                </h2>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    {projects.length} Blueprint{projects.length !== 1 ? 's' : ''} Stored
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="group relative bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-slate-50 dark:border-slate-800 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden"
                    >
                        <button
                            onClick={() => onViewProject(project)}
                            className="w-full p-8 text-left"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                                    <FileText size={22} />
                                </div>
                                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <Calendar size={12} />
                                    <span>{new Date(project.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </div>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 line-clamp-2 pr-8">
                                {project.idea}
                            </h3>
                            <div className="flex items-center space-x-2 mb-6">
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg uppercase tracking-wider">
                                    {project.domain}
                                </span>
                                {project.subDomain && (
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg uppercase tracking-wider">
                                        {project.subDomain}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center text-xs font-black text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest">
                                Review Specifications
                                <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>

                        {/* Delete button */}
                        <button
                            onClick={(e) => handleDelete(e, project.id, project.idea)}
                            disabled={deletingId === project.id}
                            className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                            title="Delete blueprint"
                        >
                            {deletingId === project.id ? (
                                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Trash2 size={16} />
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
