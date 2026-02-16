"use client";

import React, { useState } from 'react';
import { Project } from '@/lib/projects';
import Link from 'next/link';
import { ArrowUpDown, ExternalLink, ChevronUp, ChevronDown, CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';

interface ProjectTableProps {
  projects: Project[];
}

const quadrantConfig = {
    'Quick Wins': { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    'Big Bets': { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
    'Fillers': { icon: Clock, color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-100' },
    'Time Sinks': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
};

export default function ProjectTable({ projects }: ProjectTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Project | 'impact' | 'effort' | 'roi', direction: 'asc' | 'desc' } | null>(null);

  const requestSort = (key: keyof Project | 'impact' | 'effort' | 'roi') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProjects = React.useMemo(() => {
    let sortableItems = [...projects];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: number | string = 0;
        let bValue: number | string = 0;

        // Handle nested/computed properties vs direct properties
        if (sortConfig.key === 'impact') {
            aValue = a.normalized_scores.impact;
            bValue = b.normalized_scores.impact;
        } else if (sortConfig.key === 'effort') {
            aValue = a.normalized_scores.effort;
            bValue = b.normalized_scores.effort;
        } else if (sortConfig.key === 'roi') {
             aValue = a.financials ? (a.financials.projected_roi / a.financials.estimated_cost) : 0;
             bValue = b.financials ? (b.financials.projected_roi / b.financials.estimated_cost) : 0;
        } else {
            // Safe access for direct properties
            aValue = a[sortConfig.key as keyof Project] as string | number;
            bValue = b[sortConfig.key as keyof Project] as string | number;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [projects, sortConfig]);

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
      if (sortConfig?.key !== columnKey) return <ArrowUpDown size={14} className="ml-1.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />;
      return sortConfig.direction === 'asc' 
        ? <ChevronUp size={14} className="ml-1.5 text-indigo-600" />
        : <ChevronDown size={14} className="ml-1.5 text-indigo-600" />;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
                <h3 className="text-base font-bold text-slate-800">Project Details</h3>
                <p className="text-sm text-slate-500">Comprehensive list of all strategic initiatives</p>
            </div>
            {/* Can add CSV export button here later */}
        </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th 
                scope="col" 
                className="group px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => requestSort('id')}
              >
                <div className="flex items-center">ID <SortIcon columnKey="id" /></div>
              </th>
              <th 
                scope="col" 
                className="group px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => requestSort('title')}
              >
                 <div className="flex items-center">Project Name <SortIcon columnKey="title" /></div>
              </th>
              <th 
                scope="col" 
                className="group px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => requestSort('impact')}
              >
                 <div className="flex items-center">Impact <SortIcon columnKey="impact" /></div>
              </th>
              <th 
                 scope="col" 
                 className="group px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                 onClick={() => requestSort('effort')}
              >
                 <div className="flex items-center">Effort <SortIcon columnKey="effort" /></div>
              </th>
               <th 
                 scope="col" 
                 className="group px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                 onClick={() => requestSort('roi')}
              >
                <div className="flex items-center">Est. ROI <SortIcon columnKey="roi" /></div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Quadrant
              </th>
               <th scope="col" className="relative px-6 py-4">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {sortedProjects.map((project) => {
                 const qConfig = quadrantConfig[project.quadrant as keyof typeof quadrantConfig] || quadrantConfig['Fillers'];
                 const Icon = qConfig.icon;

                 return (
                    <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-500">
                        {project.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                        <div className="font-semibold text-slate-900">{project.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{project.owner} • {project.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${project.normalized_scores.impact}%` }}></div>
                            </div>
                            <span className="font-medium text-slate-700">{project.normalized_scores.impact}</span>
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-400 rounded-full" style={{ width: `${project.normalized_scores.effort}%` }}></div>
                            </div>
                            <span className="font-medium text-slate-600">{project.normalized_scores.effort}</span>
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {project.financials 
                            ? <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">{(project.financials.projected_roi / project.financials.estimated_cost).toFixed(2)}x</span>
                            : <span className="text-slate-400">-</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${qConfig.bg} ${qConfig.color} ${qConfig.border}`}>
                            <Icon size={12} className="mr-1.5" />
                            {project.quadrant}
                        </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/projects/${project.slug}`} className="text-slate-400 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-full inline-block">
                            <ExternalLink size={16} />
                        </Link>
                        </td>
                    </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
