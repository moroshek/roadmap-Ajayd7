"use client";

import React from 'react';
import { Project } from '@/lib/projects';

interface GanttChartProps {
  projects: Project[];
}

export default function GanttChart({ projects }: GanttChartProps) {
  // 1. Define Timeline Bounds (Jan 1, 2026 to Dec 31, 2027)
  const timelineStart = new Date('2026-01-01');
  const timelineEnd = new Date('2027-12-31');
  const totalDuration = timelineEnd.getTime() - timelineStart.getTime();

  // Helper to calculate position and width
  const getPosition = (dateStr: string) => {
    const date = new Date(dateStr);
    const offset = date.getTime() - timelineStart.getTime();
    return Math.max(0, (offset / totalDuration) * 100);
  };

  const getWidth = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const duration = end.getTime() - start.getTime();
    return Math.max(1, (duration / totalDuration) * 100);
  };

  // Generate Month Markers
  const months: Date[] = [];
  let currentDate = new Date(timelineStart);
  while (currentDate <= timelineEnd) {
    months.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
             <h2 className="text-base font-bold text-slate-800">Project Roadmap</h2>
             <p className="text-sm text-slate-500">Timeline view for 2026-2027</p>
        </div>
        <div className="flex items-center space-x-4 text-xs font-medium">
             <div className="flex items-center"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2"></span> Active</div>
             <div className="flex items-center"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2"></span> Queued</div>
             <div className="flex items-center"><span className="w-2.5 h-2.5 bg-slate-300 rounded-full mr-2"></span> Backlog</div>
        </div>
      </div>
      
      <div className="flex-grow overflow-hidden flex flex-col relative">
        <div className="flex-grow overflow-x-auto overflow-y-auto relative custom-scrollbar">
            <div className="min-w-[1600px] h-full relative">
                
                {/* Header Row (Months) */}
                <div className="flex h-12 sticky top-0 bg-white z-20 border-b border-slate-200 shadow-sm">
                    <div className="w-64 flex-none border-r border-slate-200 px-6 flex items-center font-bold text-xs text-slate-500 uppercase tracking-wider bg-slate-50 sticky left-0 z-30 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                        Project Name
                    </div>
                    <div className="flex-grow relative bg-slate-50/50">
                        {months.map((month, index) => {
                            const left = (index / months.length) * 100;
                            return (
                                <div 
                                    key={index} 
                                    className="absolute top-0 bottom-0 border-r border-slate-200/60 text-[10px] text-slate-400 pl-2 pt-3 font-medium overflow-hidden whitespace-nowrap"
                                    style={{ left: `${left}%`, width: `${100/months.length}%` }}
                                >
                                    {month.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Project Rows */}
                <div className="divide-y divide-slate-100">
                    {projects.map(project => {
                        const left = getPosition(project.dates.planned_start);
                        const width = getWidth(project.dates.planned_start, project.dates.planned_end);
                        
                        let barClass = 'bg-slate-300 hover:bg-slate-400';
                        if (project.status === 'Active') barClass = 'bg-emerald-500 hover:bg-emerald-600 shadow-sm';
                        if (project.status === 'Queued') barClass = 'bg-blue-500 hover:bg-blue-600 shadow-sm';

                        return (
                            <div key={project.id} className="flex h-14 hover:bg-slate-50/80 group transition-colors">
                                    {/* Sticky Project Name Column */}
                                <div className="w-64 flex-none border-r border-slate-200 px-6 flex flex-col justify-center bg-white group-hover:bg-slate-50 sticky left-0 z-10 transition-colors shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                                    <div className="truncate text-sm font-semibold text-slate-700" title={project.title}>
                                        {project.title}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate">{project.owner}</div>
                                </div>
                                
                                {/* Timeline Bar Area */}
                                <div className="flex-grow relative">
                                    {/* Vertical Grid Lines (Matches Header) */}
                                    {months.map((_, index) => (
                                        <div 
                                            key={`grid-${index}`} 
                                            className="absolute top-0 bottom-0 border-r border-slate-100"
                                            style={{ left: `${(index / months.length) * 100}%` }}
                                        />
                                    ))}

                                    {/* The Gantt Bar */}
                                    <div 
                                        className={`absolute top-3.5 h-7 rounded-md text-white text-[10px] font-medium flex items-center px-3 overflow-hidden whitespace-nowrap transition-all cursor-pointer ${barClass}`}
                                        style={{ left: `${left}%`, width: `${width}%` }}
                                        title={`${project.title}\n${project.dates.planned_start} - ${project.dates.planned_end}\nStatus: ${project.status}`}
                                    >
                                        <span className="truncate drop-shadow-sm">{width > 4 && project.title}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                    {/* Today Marker */}
                    <div 
                    className="absolute top-12 bottom-0 border-l-2 border-indigo-500/50 border-dashed z-0 pointer-events-none"
                    style={{ left: '15%' }} // Mock Today
                    >
                        <div className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded -ml-4 mt-1 border border-indigo-100">TODAY</div>
                    </div>

            </div>
        </div>
      </div>
    </div>
  );
}
