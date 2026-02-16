import { getProjects } from '@/lib/projects';
import GanttChart from '@/components/GanttChart';

export default function RoadmapPage() {
  const projects = getProjects();

  return (
    <main className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Roadmap</h1>
        <p className="text-slate-600 mt-2">
          Two-year strategic timeline for all initiatives.
        </p>
      </div>
      
      <GanttChart projects={projects} />
    </main>
  );
}
