"use client";

import React, { useState, useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
  Label,
  Cell
} from 'recharts';
import { Project } from '@/lib/projects';
import { Filter, X } from 'lucide-react';
import MatrixTooltip from '@/components/matrix/MatrixTooltip';

interface StrategyMatrixProps {
  projects: Project[];
}

const quadrantColors = {
  'Quick Wins': { bg: '#dcfce7', text: '#15803d', dot: '#22c55e', border: '#86efac' },
  'Big Bets': { bg: '#fef9c3', text: '#a16207', dot: '#eab308', border: '#fde047' },
  'Time Sinks': { bg: '#fee2e2', text: '#b91c1c', dot: '#ef4444', border: '#fca5a5' },
  'Fillers': { bg: '#f1f5f9', text: '#334155', dot: '#94a3b8', border: '#cbd5e1' },
};

export default function StrategyMatrix({ projects }: StrategyMatrixProps) {
  // Filters State
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedPhase, setSelectedPhase] = useState<string>('All');

  // Extract unique options
  const departments = useMemo(() => ['All', ...Array.from(new Set(projects.map(p => p.department)))], [projects]);
  const phases = useMemo(() => ['All', ...Array.from(new Set(projects.map(p => p.phase)))], [projects]);

  // Filter Data
  const filteredData = useMemo(() => {
    return projects.filter(p => {
        const matchDept = selectedDept === 'All' || p.department === selectedDept;
        const matchPhase = selectedPhase === 'All' || p.phase === selectedPhase;
        return matchDept && matchPhase;
    }).map(p => ({
        ...p,
        x: p.normalized_scores.effort,
        y: p.normalized_scores.impact,
    }));
  }, [projects, selectedDept, selectedPhase]);

  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  // Calculate counts
  const getCount = (key: 'department' | 'phase', value: string) => {
      if (value === 'All') return projects.length;
      return projects.filter(p => p[key] === value).length;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[800px] lg:h-[700px]">
        {/* Filters Panel */}
        <div className={`flex-none bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col transition-all duration-300 ${isFiltersOpen ? 'w-full lg:w-80' : 'w-full lg:w-20'}`}>
            
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                {isFiltersOpen ? (
                   <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <Filter size={18} className="text-slate-500"/> 
                       Filters
                   </h3>
                ) : (
                    <div className="w-full flex justify-center">
                        <Filter size={20} className="text-slate-500"/>
                    </div>
                )}
                <button 
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                >
                    {isFiltersOpen ? <X size={18} /> : <div className="sr-only">Expand</div>}
                </button>
            </div>
            
            {isFiltersOpen && (
                <div className="p-4 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Department Section */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                            {selectedDept !== 'All' && (
                                <button onClick={() => setSelectedDept('All')} className="text-[10px] text-indigo-600 hover:text-indigo-700 font-medium">Clear</button>
                            )}
                        </div>
                        <div className="space-y-1">
                            {departments.map(dept => {
                                const count = getCount('department', dept);
                                const isActive = selectedDept === dept;
                                return (
                                    <button
                                        key={dept}
                                        onClick={() => setSelectedDept(dept)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                                            isActive 
                                                ? 'bg-indigo-50 text-indigo-700 font-medium ring-1 ring-indigo-200' 
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span className="truncate mr-2">{dept}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                            isActive ? 'bg-white text-indigo-700 shadow-sm' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Phase Section */}
                    <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phase</label>
                             {selectedPhase !== 'All' && (
                                <button onClick={() => setSelectedPhase('All')} className="text-[10px] text-indigo-600 hover:text-indigo-700 font-medium">Clear</button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {phases.map(phase => {
                                const isActive = selectedPhase === phase;
                                return (
                                    <button
                                        key={phase}
                                        onClick={() => setSelectedPhase(phase)}
                                         className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                            isActive 
                                                ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        {phase}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
             
             {/* Legend Footer */}
             {isFiltersOpen && (
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                     <div className="grid grid-cols-2 gap-2">
                        {Object.entries(quadrantColors).map(([name, colors]) => (
                            <div key={name} className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.dot }}></div>
                                <span className="text-[10px] text-slate-600 font-medium">{name}</span>
                            </div>
                        ))}
                     </div>
                </div>
             )}
        </div>

        {/* Chart Area */}
        <div className="flex-grow bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Portfolio Details</h2>
                    <p className="text-sm text-slate-500">Strategic impact vs. implementation effort</p>
                </div>
                 <div className="text-right">
                     <div className="text-2xl font-bold text-slate-900">{filteredData.length}</div>
                     <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Projects</div>
                 </div>
            </div>
            
            <div className="flex-grow w-full h-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                        type="number" 
                        dataKey="x" 
                        name="Effort" 
                        domain={[0, 100]} 
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        label={{ value: 'Effort (Complexity) →', position: 'bottom', offset: 0, fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                    />
                    <YAxis 
                        type="number" 
                        dataKey="y" 
                        name="Impact" 
                        domain={[0, 100]} 
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        label={{ value: 'Impact (Value) →', angle: -90, position: 'left', offset: 10, fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip content={<MatrixTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#94a3b8' }} />
                    
                    {/* Quadrant Backgrounds */}
                    <ReferenceArea x1={0} x2={50} y1={50} y2={100} fill={quadrantColors['Quick Wins'].bg} fillOpacity={0.4} stroke="none" />
                    <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill={quadrantColors['Big Bets'].bg} fillOpacity={0.4} stroke="none" />
                    <ReferenceArea x1={0} x2={50} y1={0} y2={50} fill={quadrantColors['Fillers'].bg} fillOpacity={0.4} stroke="none" />
                    <ReferenceArea x1={50} x2={100} y1={0} y2={50} fill={quadrantColors['Time Sinks'].bg} fillOpacity={0.4} stroke="none" />

                    {/* Quadrant Labels */}
                    <ReferenceArea x1={0} x2={50} y1={50} y2={100} fill="none">
                         <Label value="QUICK WINS" position="insideTopLeft" offset={20} className="fill-green-700 text-xs font-bold opacity-60" />
                    </ReferenceArea>
                    <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill="none">
                         <Label value="BIG BETS" position="insideTopRight" offset={20} className="fill-yellow-700 text-xs font-bold opacity-60" />
                    </ReferenceArea>
                    <ReferenceArea x1={0} x2={50} y1={0} y2={50} fill="none">
                         <Label value="FILLERS" position="insideBottomLeft" offset={20} className="fill-slate-500 text-xs font-bold opacity-60" />
                    </ReferenceArea>
                    <ReferenceArea x1={50} x2={100} y1={0} y2={50} fill="none">
                         <Label value="TIME SINKS" position="insideBottomRight" offset={20} className="fill-red-700 text-xs font-bold opacity-60" />
                    </ReferenceArea>

                    <ReferenceLine x={50} stroke="#94a3b8" strokeWidth={1} />
                    <ReferenceLine y={50} stroke="#94a3b8" strokeWidth={1} />

                    <Scatter name="Projects" data={filteredData} isAnimationActive={true}>
                         {filteredData.map((entry, index) => {
                             const qColor = quadrantColors[entry.quadrant as keyof typeof quadrantColors] || quadrantColors['Fillers'];
                             return (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={qColor.dot} 
                                    stroke="#fff" 
                                    strokeWidth={2}
                                    style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.1))' }}
                                />
                             );
                         })}
                    </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
}
