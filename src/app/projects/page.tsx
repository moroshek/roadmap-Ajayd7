import { getProjects } from '@/lib/projects';
import ProjectTable from '@/components/ProjectTable';
import { Package } from 'lucide-react';

export default function ProjectsPage() {
    const projects = getProjects();

    return (
        <main className="min-h-screen bg-slate-50/50 pb-20 animate-fade-in">
            {/* Page Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-[1400px] mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
                                    <Package size={20} className="text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Projects Inventory</h1>
                            </div>
                            <p className="text-slate-500 text-sm font-medium ml-[44px]">
                                Complete list of all strategic initiatives and project metadata.
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-3xl font-black text-slate-900 leading-none">{projects.length}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Assets</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-8">
                <ProjectTable projects={projects} />
            </div>
        </main>
    );
}
