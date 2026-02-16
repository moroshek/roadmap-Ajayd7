"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { Search, X } from 'lucide-react';
import { Project } from '@/lib/projects';
import Link from 'next/link';

// Fuse.js options
const fuseOptions = {
    keys: [
        { name: 'title', weight: 1.0 },
        { name: 'slug', weight: 0.8 },
        { name: 'id', weight: 0.8 },
        { name: 'tags', weight: 0.6 },
        { name: 'owner', weight: 0.4 },
        // Content is not included in the Project type for client-side search yet, 
        // as it might be too heavy. We stick to metadata for now.
    ],
    threshold: 0.3, // Strict matching
    distance: 100,
};

interface GlobalSearchProps {
    projects: Project[];
}

export default function GlobalSearch({ projects }: GlobalSearchProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    
    // Initialize Fuse
    const fuse = useMemo(() => new Fuse(projects, fuseOptions), [projects]);

    // Compute results
    const results = useMemo(() => {
        if (!query) return [];
        return fuse.search(query).map(result => result.item);
    }, [query, fuse]);

    // Handle Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
                // Ideally focus input here
                document.getElementById('global-search-input')?.focus();
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="relative">
             {/* Trigger / Input */}
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search size={16} />
                </div>
                <input
                    id="global-search-input"
                    type="text"
                    className="block w-full md:w-64 pl-10 pr-12 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Search... (Cmd+K)"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (e.target.value.length > 0) setIsOpen(true);
                    }}
                    onFocus={() => {
                        if (query.length > 0) setIsOpen(true);
                    }}
                />
                 {query && (
                    <button 
                        onClick={() => { setQuery(''); setIsOpen(false); }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && query.length > 0 && (
                <>
                {/* Overlay to close on click outside */}
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-96 overflow-y-auto w-full md:w-96">
                    {results.length === 0 ? (
                         <div className="p-4 text-center text-slate-500 text-sm">
                            No projects found matching "{query}"
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {results.map(project => (
                                <li key={project.id} className="group">
                                    <Link href={`/projects/${project.slug}`} className="block p-3 hover:bg-slate-50 transition-colors" onClick={() => { setQuery(''); setIsOpen(false); }}>
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600">{project.title}</p>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                                project.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>{project.status}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-slate-500 mt-1 space-x-2">
                                            <span>{project.id}</span>
                                            <span>•</span>
                                            <span>{project.owner}</span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                </>
            )}
        </div>
    );
}
