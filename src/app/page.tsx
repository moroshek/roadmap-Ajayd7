import { getProjects } from "@/lib/projects";
import { DollarSign, TrendingUp, Activity, Briefcase } from "lucide-react";

export default function Home() {
  const projects = getProjects();

  // Calculate Metrics
  const totalInvestment = projects.reduce((sum, p) => sum + (p.financials?.estimated_cost || 0), 0);
  const totalROI = projects.reduce((sum, p) => sum + (p.financials?.projected_roi || 0), 0);
  const activeCount = projects.filter(p => p.status === 'Active').length;
  const roiMultiplier = totalInvestment > 0 ? (totalROI / totalInvestment).toFixed(2) : "0.00";

  // Formatter for Currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-12">
      {/* Premium Page Header */}
      <div className="bg-gradient-to-r from-white via-white to-slate-50/30 border-b border-slate-200/80 shadow-sm">
          <div className="max-w-[1400px] mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg shadow-md shadow-indigo-600/20">
                        <Activity size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
                        <p className="text-sm text-slate-600 font-medium mt-0.5">Portfolio performance and activity</p>
                    </div>
                </div>
            </div>
          </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-4 space-y-4">
        {/* Compact Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Investment Card */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign size={18} className="text-blue-600" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Total Investment</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalInvestment)}</p>
            </div>
          </div>

          {/* ROI Multiplier Card */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <TrendingUp size={18} className="text-emerald-600" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">ROI Multiplier</p>
              <p className="text-2xl font-bold text-slate-900">{roiMultiplier}x</p>
            </div>
          </div>

          {/* Active Projects Card */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 hover:border-purple-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Activity size={18} className="text-purple-600" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Active Projects</p>
              <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
            </div>
          </div>

          {/* Total Initiatives Card */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 hover:border-orange-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Briefcase size={18} className="text-orange-600" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Total Initiatives</p>
              <p className="text-2xl font-bold text-slate-900">{projects.length}</p>
            </div>
          </div>
        </div>

        {/* Strategic Phase + Recent Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Strategic Phase */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Strategic Phase</h2>
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md uppercase tracking-wide">Current</span>
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Phase 1: Foundation</h3>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <p className="text-xs text-slate-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                65% of foundation projects initiated
              </p>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Recent Projects</h2>
            <div className="space-y-2">
              {projects.slice(0, 3).map((project) => (
                <div 
                  key={project.id} 
                  className="p-2.5 rounded-lg hover:bg-slate-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 mb-0.5 hover:text-indigo-600 transition-colors truncate">
                        {project.title}
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        {project.id} • {project.owner}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md whitespace-nowrap ${
                      project.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : project.status === 'Queued'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-50 text-slate-600 border border-slate-200'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
