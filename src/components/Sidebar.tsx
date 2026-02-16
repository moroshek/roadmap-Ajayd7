"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ScatterChart, Map } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function Sidebar() {
    const pathname = usePathname();
    
    const links = [
        { href: '/', label: 'Overview', icon: LayoutDashboard },
        { href: '/matrix', label: 'Strategy Matrix', icon: ScatterChart },
        { href: '/roadmap', label: 'Roadmap (Gantt)', icon: Map },
    ];

    return (
        <div className="w-full flex-none md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between h-screen sticky top-0">
            <div className="p-6">
                 <div className="flex items-center space-x-3 mb-10 text-white">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/20">
                        <span className="font-bold text-lg text-white">R</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight leading-none">Roadmap</h1>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Engine</span>
                    </div>
                </div>

                <nav className="flex flex-col space-y-1.5">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link 
                                key={link.href}
                                href={link.href} 
                                className={cn(
                                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group",
                                    isActive 
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20" 
                                        : "hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <Icon size={18} className={cn("transition-colors", isActive ? "text-indigo-200" : "text-slate-500 group-hover:text-slate-300")} />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                <div className="flex items-center space-x-3 group cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 ring-2 ring-slate-800 group-hover:ring-slate-700 transition-all"></div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white group-hover:text-indigo-200 transition-colors truncate">Admin User</p>
                        <p className="text-xs text-slate-500 truncate">admin@autonova.com</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
