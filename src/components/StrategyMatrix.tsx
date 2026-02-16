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
                            {Object.entries(quadrantColors).map(([name, colors]) => {
                                const isActive = selectedQuadrants.includes(name);
                                return (
                                    <button
                                        key={name}
                                        onClick={() => toggleQuadrant(name)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
                                            isActive
                                                ? 'border-slate-900 shadow-md'
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                        style={{
                                            backgroundColor: isActive ? colors.bg : 'white',
                                            color: isActive ? colors.text : '#64748b'
                                        }}
                                    >
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.dot }}></div>
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
                        <ReferenceArea x1={0} x2={50} y1={50} y2={100} fill={quadrantColors['Quick Wins'].bg} fillOpacity={0.3} />
                        <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill={quadrantColors['Big Bets'].bg} fillOpacity={0.3} />
                        <ReferenceArea x1={0} x2={50} y1={0} y2={50} fill={quadrantColors['Fillers'].bg} fillOpacity={0.3} />
                        <ReferenceArea x1={50} x2={100} y1={0} y2={50} fill={quadrantColors['Time Sinks'].bg} fillOpacity={0.3} />
                        
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
                                    fill={quadrantColors[entry.quadrant].dot}
                                    stroke={quadrantColors[entry.quadrant].border}
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
