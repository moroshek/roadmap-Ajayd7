import { getProjects } from '@/lib/projects';
import StrategyMatrix from '@/components/StrategyMatrix';
import ProjectTable from '@/components/ProjectTable';
import { LayoutDashboard } from 'lucide-react';

export default function MatrixPage() {
  const projects = getProjects();

  return (
    <main className="min-h-screen bg-slate-50/50 pb-12">
      {/* Premium Page Header */}
      <div className="bg-gradient-to-r from-white via-white to-slate-50/30 border-b border-slate-200/80 shadow-sm">
          <div className="max-w-[1400px] mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg shadow-md shadow-indigo-600/20">
                        <LayoutDashboard size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Strategy Matrix</h1>
                        <p className="text-sm text-slate-600 font-medium mt-0.5">Strategic impact vs. implementation effort</p>
                    </div>
                </div>
            </div>
          </div>
      </div>
      
      <div className="max-w-[1400px] mx-auto px-4 py-4 space-y-4">
        <StrategyMatrix projects={projects} />

        <div className="pt-4 border-t border-slate-200">
           <ProjectTable projects={projects} />
        </div>
      </div>
    </main>
  );
}
