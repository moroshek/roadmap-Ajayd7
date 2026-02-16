import { getProjects } from '@/lib/projects';
import StrategyMatrix from '@/components/StrategyMatrix';
import ProjectTable from '@/components/ProjectTable';
import { LayoutDashboard } from 'lucide-react';

export default function MatrixPage() {
  const projects = getProjects();

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
          <div className="max-w-[1600px] mx-auto px-6 py-8">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
                    <LayoutDashboard size={24} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Strategy Matrix</h1>
            </div>
            <p className="text-slate-600 text-lg max-w-2xl ml-[52px]">
              Visualize and analyze your project portfolio based on strategic impact versus implementation effort.
            </p>
          </div>
      </div>
      
      <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
        <StrategyMatrix projects={projects} />

        <div className="pt-8 border-t border-slate-200">
           <ProjectTable projects={projects} />
        </div>
      </div>
    </main>
  );
}
