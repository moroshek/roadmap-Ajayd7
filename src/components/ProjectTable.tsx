"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Project } from '@/lib/projects';
import Link from 'next/link';
import { 
    Search, 
    ArrowUpRight, 
    ArrowUpDown, 
    ChevronUp, 
    ChevronDown, 
    Info
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { QUADRANT_CONFIG, STATUS_CONFIG } from '@/lib/constants';

interface ProjectTableProps {
    projects: Project[];
}

const PROJECTS_PER_PAGE = 10;

export default function ProjectTable({ projects }: ProjectTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
    const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const loadingRef = useRef(false);
    const loader = useRef(null);

    // Filter and Sort Logic
    const processedProjects = useMemo(() => {
        let result = projects.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 p.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        if (sortConfig) {
            result.sort((a, b) => {
                let aValue: any;
                let bValue: any;

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
                    aValue = a[sortConfig.key as keyof Project];
                    bValue = b[sortConfig.key as keyof Project];
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [projects, searchTerm, statusFilter, sortConfig]);

    // Reset displayed projects when processed list changes
    useEffect(() => {
        setDisplayedProjects(processedProjects.slice(0, PROJECTS_PER_PAGE));
    }, [processedProjects]);

    // Infinite Scroll logic
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0
        };

        const observer = new IntersectionObserver((entities) => {
            const target = entities[0];
            // Only trigger if we have more to load and not already loading
            // Use loadingRef to avoid race conditions
            if (target.isIntersecting && !loadingRef.current && displayedProjects.length < processedProjects.length) {
                loadMore();
            }
        }, options);

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => {
            if (loader.current) observer.unobserve(loader.current);
        };
    }, [displayedProjects.length, processedProjects.length]);

    const loadMore = () => {
        if (loadingRef.current) return;
        
        setLoading(true);
        loadingRef.current = true;
        
        // Small timeout to allow user to see loading state
        setTimeout(() => {
            setDisplayedProjects(prev => {
                const nextBatch = processedProjects.slice(
                    prev.length, 
                    prev.length + PROJECTS_PER_PAGE
                );
                return [...prev, ...nextBatch];
            });
            setLoading(false);
            loadingRef.current = false;
        }, 400);
    };

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon = ({ colKey }: { colKey: string }) => {
        if (sortConfig?.key !== colKey) return <ArrowUpDown size={14} className="ml-1 opacity-20 group-hover:opacity-100 transition-opacity" />;
        return sortConfig.direction === 'asc' 
            ? <ChevronUp size={14} className="ml-1 text-indigo-600" />
            : <ChevronDown size={14} className="ml-1 text-indigo-600" />;
    };

    const statuses = ['All', 'Active', 'Queued', 'Backlog', 'At Risk', 'Complete', 'On Hold'];

    const allLoaded = displayedProjects.length >= processedProjects.length;

    return (
        <div className="space-y-4">
            {/* Table Header / Filters */}
            <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search by ID or title..." 
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                        {statuses.map(status => {
                            const sc = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
                            return (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={cn(
                                        "whitespace-nowrap px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider border transition-all",
                                        statusFilter === status 
                                            ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                                            : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                                        status === 'At Risk' && statusFilter !== status && "hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                                    )}
                                >
                                    {status}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center justify-between xl:justify-end gap-6 border-t xl:border-t-0 pt-3 xl:pt-0">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Info size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                            {processedProjects.length} Projects Matched
                        </span>
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200">
                                <th onClick={() => requestSort('id')} className="group px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center">ID <SortIcon colKey="id" /></div>
                                </th>
                                <th onClick={() => requestSort('title')} className="group px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center">Project Name <SortIcon colKey="title" /></div>
                                </th>
                                <th onClick={() => requestSort('impact')} className="group px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center">Impact <SortIcon colKey="impact" /></div>
                                </th>
                                <th onClick={() => requestSort('effort')} className="group px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center">Effort <SortIcon colKey="effort" /></div>
                                </th>
                                <th onClick={() => requestSort('roi')} className="group px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center">Est. ROI <SortIcon colKey="roi" /></div>
                                </th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Strategic Fit</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {displayedProjects.map((project) => {
                                const qConfig = QUADRANT_CONFIG[project.quadrant] || QUADRANT_CONFIG['Fillers'];
                                const sConfig = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG['Queued'];
                                const QIcon = qConfig.icon;
                                const SIcon = sConfig.icon;
                                return (
                                    <tr key={project.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-400 font-medium">#{project.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 line-clamp-1">{project.title}</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded leading-none border",
                                                        sConfig.bg, sConfig.color, sConfig.border
                                                    )}>
                                                        <SIcon size={10} strokeWidth={3} />
                                                        {project.status}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-medium">{project.department}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 min-w-[60px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${project.normalized_scores.impact}%` }}></div>
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-600">{project.normalized_scores.impact}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 min-w-[60px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-slate-300 rounded-full" style={{ width: `${project.normalized_scores.effort}%` }}></div>
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-400">{project.normalized_scores.effort}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {project.financials 
                                                ? <span className="text-emerald-600 font-black text-xs">{(project.financials.projected_roi / project.financials.estimated_cost).toFixed(2)}x</span>
                                                : <span className="text-slate-300">-</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all",
                                                qConfig.bg, qConfig.color, qConfig.border
                                            )}>
                                                <QIcon size={12} strokeWidth={3} />
                                                {project.quadrant.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link 
                                                href={`/projects/${project.slug}`}
                                                className="inline-flex items-center justify-center w-8 h-8 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                                            >
                                                <ArrowUpRight size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Infinite Scroll Loader */}
                {!allLoaded && (
                    <div ref={loader} className="p-10 flex justify-center bg-slate-50/30 border-t border-slate-100">
                        {loading ? (
                            <div className="flex items-center gap-3 text-indigo-600">
                                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-xs font-bold uppercase tracking-widest">Hydrating data...</span>
                            </div>
                        ) : (
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">End of loaded phase • Scroll for more</span>
                        )}
                    </div>
                )}

                {allLoaded && processedProjects.length > 0 && (
                    <div className="p-10 flex flex-col items-center gap-2 bg-slate-50/10 border-t border-slate-100">
                        <div className="w-12 h-1 bg-slate-200 rounded-full mb-1"></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] opacity-40">All Strategic Assets Discovered</span>
                    </div>
                )}

                {processedProjects.length === 0 && (
                    <div className="py-24 text-center bg-white">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-200 mb-4 border border-slate-100">
                            <Search size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Vacuum Detected</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">No projects matching your current filters were found in our database.</p>
                        <button 
                            onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                            className="mt-6 text-xs font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4 decoration-2"
                        >
                            Reset all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
