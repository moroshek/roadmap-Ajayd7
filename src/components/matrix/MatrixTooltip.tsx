import React from 'react';

// Define the shape of the data expected in the payload
interface TooltipData {
  title: string;
  quadrant: string;
  id: string;
  owner: string;
  normalized_scores: {
    impact: number;
    effort: number;
  };
  financials?: {
    projected_roi: number;
    estimated_cost: number;
  };
}

interface MatrixTooltipProps {
  active?: boolean;
  payload?: { payload: TooltipData }[];
}

const quadrantColors = {
  'Quick Wins': { bg: '#dcfce7', text: '#15803d', dot: '#22c55e', border: '#86efac' },
  'Big Bets': { bg: '#fef9c3', text: '#a16207', dot: '#eab308', border: '#fde047' },
  'Time Sinks': { bg: '#fee2e2', text: '#b91c1c', dot: '#ef4444', border: '#fca5a5' },
  'Fillers': { bg: '#f1f5f9', text: '#334155', dot: '#94a3b8', border: '#cbd5e1' },
};

export default function MatrixTooltip({ active, payload }: MatrixTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const qColor = quadrantColors[data.quadrant as keyof typeof quadrantColors] || quadrantColors['Fillers'];

    return (
      <div className="bg-white p-0 border border-slate-200 shadow-xl rounded-lg z-50 min-w-[240px] overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
           <h4 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight pr-2">{data.title}</h4>
           <div className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border`} style={{ backgroundColor: qColor.bg, color: qColor.text, borderColor: qColor.border }}>
             {data.quadrant}
           </div>
        </div>
        
        <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">ID</span>
                <span className="font-mono text-slate-700">{data.id}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                     <span className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Impact</span>
                     <div className="flex items-end">
                        <span className="font-bold text-indigo-600 text-lg leading-none">{data.normalized_scores.impact}</span>
                        <span className="text-[10px] text-slate-400 ml-1 mb-0.5">/100</span>
                     </div>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                     <span className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Effort</span>
                      <div className="flex items-end">
                        <span className="font-bold text-slate-600 text-lg leading-none">{data.normalized_scores.effort}</span>
                        <span className="text-[10px] text-slate-400 ml-1 mb-0.5">/100</span>
                     </div>
                </div>
            </div>

             <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-x-4 text-xs">
                 <div>
                     <span className="block text-[10px] text-slate-400">Owner</span>
                     <span className="text-slate-700 font-medium truncate block">{data.owner}</span>
                </div>
                 <div className="text-right">
                     <span className="block text-[10px] text-slate-400">Est. ROI</span>
                     <span className="text-emerald-600 font-bold block">
                        {data.financials ? (data.financials.projected_roi / data.financials.estimated_cost).toFixed(1) + 'x' : '-'}
                     </span>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return null;
}
