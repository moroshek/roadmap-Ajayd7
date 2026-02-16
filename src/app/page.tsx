import { getProjects } from "@/lib/projects";
import { DollarSign, TrendingUp, Activity, Briefcase } from "lucide-react";

export default function Home() {
  const projects = getProjects();

  // 1. Calculate Metrics
  const totalInvestment = projects.reduce((sum, p) => sum + (p.financials?.estimated_cost || 0), 0);
  const totalROI = projects.reduce((sum, p) => sum + (p.financials?.projected_roi || 0), 0);
  const activeCount = projects.filter(p => p.status === 'Active').length;
  const roiMultiplier = totalInvestment > 0 ? (totalROI / totalInvestment).toFixed(2) : "0.00";

  // 2. Formatter for Currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <main className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Executive Dashboard</h1>
        <p className="text-slate-600 mt-2">High-level portfolio performance and activity.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         {/* Total Investment */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <DollarSign size={24} />
            </div>
            <div>
                <p className="text-sm text-slate-500 font-medium">Total Investment</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalInvestment)}</p>
            </div>
        </div>

        {/* ROI Multiplier */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
                <TrendingUp size={24} />
            </div>
             <div>
                <p className="text-sm text-slate-500 font-medium">ROI Multiplier</p>
                <p className="text-2xl font-bold text-slate-900">{roiMultiplier}x</p>
            </div>
        </div>

         {/* Active Projects */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                <Activity size={24} />
            </div>
             <div>
                <p className="text-sm text-slate-500 font-medium">Active Projects</p>
                <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
            </div>
        </div>

        {/* Total Projects */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                <Briefcase size={24} />
            </div>
             <div>
                <p className="text-sm text-slate-500 font-medium">Total Initiatives</p>
                <p className="text-2xl font-bold text-slate-900">{projects.length}</p>
            </div>
        </div>
      </div>

        {/* Recent Activity / Phase Indicator Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4 text-slate-800">Strategic Phase</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">Phase 1: Foundation</span>
                        <span className="text-slate-500">Current</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                     <p className="text-xs text-slate-500 mt-2">65% of foundation projects initiated.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-lg mb-4 text-slate-800">Recent Projects</h3>
                 <ul className="space-y-3">
                    {projects.slice(0, 3).map(p => (
                        <li key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                            <div>
                                <p className="font-medium text-slate-900 text-sm">{p.title}</p>
                                <p className="text-xs text-slate-500">{p.id} • {p.owner}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full border ${
                                p.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 
                                p.status === 'Queued' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                'bg-slate-200 text-slate-700 border-slate-300'
                            }`}>{p.status}</span>
                        </li>
                    ))}
                 </ul>
            </div>
        </div>
    </main>
  );
}
