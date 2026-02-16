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
import { ChevronDown, X } from 'lucide-react';
import MatrixTooltip from '@/components/matrix/MatrixTooltip';
import { QUADRANT_CONFIG } from '@/lib/constants';

interface StrategyMatrixProps {
  projects: Project[];
}

export default function StrategyMatrix({ projects }: StrategyMatrixProps) {
  // Filters State
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedPhase, setSelectedPhase] = useState<string>('All');
  const [selectedQuadrants, setSelectedQuadrants] = useState<string[]>([]);
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);

  // Extract unique options
  const departments = useMemo(() => ['All', ...Array.from(new Set(projects.map(p => p.department)))], [projects]);
  const phases = useMemo(() => ['All', ...Array.from(new Set(projects.map(p => p.phase)))], [projects]);

  // Filter Data
  const filteredData = useMemo(() => {
    return projects.filter(p => {
        const matchDept = selectedDept === 'All' || p.department === selectedDept;
        const matchPhase = selectedPhase === 'All' || p.phase === selectedPhase;
        const matchQuadrant = selectedQuadrants.length === 0 || selectedQuadrants.includes(p.quadrant);
        return matchDept && matchPhase && matchQuadrant;
    }).map(p => ({
        ...p,
        x: p.normalized_scores.effort,
        y: p.normalized_scores.impact,
    }));
  }, [projects, selectedDept, selectedPhase, selectedQuadrants]);

  // Toggle quadrant filter
  const toggleQuadrant = (quadrant: string) => {
    setSelectedQuadrants(prev =>
      prev.includes(quadrant)
        ? prev.filter(q => q !== quadrant)
        : [...prev, quadrant]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedDept('All');
    setSelectedPhase('All');
    setSelectedQuadrants([]);
  };

  const hasActiveFilters = selectedDept !== 'All' || selectedPhase !== 'All' || selectedQuadrants.length > 0;

    return (
        <div className="space-y-4">
            {/* Horizontal Filter Bar */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Department Dropdown */}
                    <div className="relative">
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Department</label>
                        <div className="relative">
                            <button
                                onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                                className="flex items-center justify-between gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:border-indigo-400 hover:bg-slate-50 transition-all min-w-[180px]"
                            >
                                <span className="truncate">{selectedDept}</span>
                                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDeptDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isDeptDropdownOpen && (
                                <div className="absolute z-10 mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                    {departments.map(dept => (
                                        <button
                                            key={dept}
                                            onClick={() => {
                                                setSelectedDept(dept);
                                                setIsDeptDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${
                                                selectedDept === dept ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{dept}</span>
                                                <span className="text-xs text-slate-500">
                                                    {dept === 'All' ? projects.length : projects.filter(p => p.department === dept).length}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Phase Segmented Control */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phase</label>
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                            {phases.map(phase => (
                                <button
                                    key={phase}
                                    onClick={() => setSelectedPhase(phase)}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                        selectedPhase === phase
                                            ? 'bg-white text-indigo-700 shadow-sm'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    {phase}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quadrant Chips */}
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Quadrants</label>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(QUADRANT_CONFIG).map(([name, config]) => {
                                const isActive = selectedQuadrants.includes(name);
                                const Icon = config.icon;
                                return (
                                    <button
                                        key={name}
                                        onClick={() => toggleQuadrant(name)}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all uppercase tracking-wider",
                                            isActive
                                                ? cn("shadow-md border-slate-900", config.bg, config.color)
                                                : "border-slate-200 hover:border-slate-300 text-slate-400 bg-white"
                                        )}
                                    >
                                        <Icon size={14} strokeWidth={3} />
                                        {name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Results Count & Clear */}
                    <div className="flex items-end gap-3 ml-auto">
                        <div className="text-right">
                            <div className="text-2xl font-bold text-indigo-600">{filteredData.length}</div>
                            <div className="text-xs text-slate-500 font-medium">Projects</div>
                        </div>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all flex items-center gap-1"
                            >
                                <X size={14} />
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-[600px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        
                        {/* Quadrant Backgrounds */}
                        <ReferenceArea x1={0} x2={50} y1={50} y2={100} fill={QUADRANT_CONFIG['Quick Wins'].bgHex} fillOpacity={0.4}>
                            <Label value="QUICK WINS" position="insideTopLeft" fill="#64748b" style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.1em' }} offset={20} />
                        </ReferenceArea>
                        <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill={QUADRANT_CONFIG['Big Bets'].bgHex} fillOpacity={0.4}>
                            <Label value="BIG BETS" position="insideTopRight" fill="#64748b" style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.1em' }} offset={20} />
                        </ReferenceArea>
                        <ReferenceArea x1={0} x2={50} y1={0} y2={50} fill={QUADRANT_CONFIG['Fillers'].bgHex} fillOpacity={0.4}>
                            <Label value="FILLERS" position="insideBottomLeft" fill="#94a3b8" style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.1em' }} offset={20} />
                        </ReferenceArea>
                        <ReferenceArea x1={50} x2={100} y1={0} y2={50} fill={QUADRANT_CONFIG['Time Sinks'].bgHex} fillOpacity={0.4}>
                            <Label value="TIME SINKS" position="insideBottomRight" fill="#94a3b8" style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.1em' }} offset={20} />
                        </ReferenceArea>
                        
                        {/* Center Lines */}
                        <ReferenceLine x={50} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                        <ReferenceLine y={50} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                        
                        {/* Axes */}
                        <XAxis 
                            type="number" 
                            dataKey="x" 
                            name="Effort" 
                            domain={[0, 100]}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickLine={{ stroke: '#cbd5e1' }}
                        >
                            <Label 
                                value="Implementation Effort →" 
                                position="bottom" 
                                offset={40}
                                style={{ fill: '#475569', fontSize: 14, fontWeight: 600 }}
                            />
                        </XAxis>
                        <YAxis 
                            type="number" 
                            dataKey="y" 
                            name="Impact" 
                            domain={[0, 100]}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickLine={{ stroke: '#cbd5e1' }}
                        >
                            <Label 
                                value="Strategic Impact →" 
                                angle={-90} 
                                position="left"
                                offset={40}
                                style={{ fill: '#475569', fontSize: 14, fontWeight: 600 }}
                            />
                        </YAxis>
                        
                        <Tooltip content={<MatrixTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        
                        <Scatter name="Projects" data={filteredData} shape="circle">
                            {filteredData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={QUADRANT_CONFIG[entry.quadrant].dot}
                                    stroke={QUADRANT_CONFIG[entry.quadrant].border}
                                    strokeWidth={2}
                                    r={8}
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

import { cn } from '@/lib/utils';
