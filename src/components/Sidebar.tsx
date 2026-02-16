"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ScatterChart, Map } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function Sidebar() {
    const pathname = usePathname();
    
    const links = [
        { href: '/', label: 'Overview', icon: LayoutDashboard },
        { href: '/projects', label: 'Projects Inventory', icon: Map },
        { href: '/matrix', label: 'Strategy Matrix', icon: ScatterChart },
        { href: '/roadmap', label: 'Roadmap (Gantt)', icon: Map },
    ];

    return (
        <div className="w-full flex-none md:w-[220px] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-300 flex flex-col justify-between h-screen sticky top-0 shadow-xl border-r border-slate-800">
            <div className="p-4">
                 <div className="flex items-center gap-2 mb-6 text-white group cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/30 group-hover:shadow-indigo-900/50 transition-all duration-300">
                        <span className="font-bold text-base text-white">R</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-sm font-bold tracking-tight leading-none truncate">Roadmap Engine</h1>
                    </div>
                </div>

                <nav className="flex flex-col space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link 
                                key={link.href}
                                href={link.href} 
                                className={cn(
                                    "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium group relative overflow-hidden",
                                    isActive 
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20" 
                                        : "hover:bg-slate-800/50 hover:text-white"
                                )}
                            >
                                <Icon size={18} className={cn("transition-all flex-shrink-0", isActive ? "text-indigo-100" : "text-slate-400 group-hover:text-slate-200")} />
                                <span className="truncate">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            
            <div className="p-4 border-t border-slate-800 bg-slate-900/80">
                <div className="flex items-center gap-2 group cursor-pointer hover:bg-slate-800/50 p-2 rounded-lg transition-all duration-200">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 ring-2 ring-slate-700 group-hover:ring-indigo-500 transition-all duration-300 flex-shrink-0 shadow-md"></div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white group-hover:text-indigo-200 transition-colors truncate">Admin User</p>
                        <p className="text-[10px] text-slate-400 truncate">admin@autonova.com</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
