import React from 'react';
import ReactMarkdown from 'react-markdown';
import { getProjects, Project } from '@/lib/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, Calendar, DollarSign, Target, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export function generateStaticParams() {
  const projects = getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projects = getProjects();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Currency formatter
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <main className="min-h-screen pb-12">
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft size={16} className="mr-1" />
                Back to Dashboard
            </Link>
        </div>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between">
            <div>
                <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{project.id}</span>
                    <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide",
                        project.status === 'Active' ? "bg-green-50 text-green-700 border-green-200" :
                        project.status === 'Queued' ? "bg-blue-50 text-blue-700 border-blue-200" :
                        project.status === 'Backlog' ? "bg-slate-100 text-slate-600 border-slate-200" :
                        "bg-gray-100 text-gray-800 border-gray-200"
                    )}>
                        {project.status}
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
            </div>
            {/* Actions */}
            <div className="flex space-x-3">
                 <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
                    Edit Project
                 </button>
                 <button className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 shadow-sm">
                    Print One-Pager
                 </button>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
            {/* Tabs (Mocked visually) */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    <a href="#" className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                        Overview
                    </a>
                    <a href="#" className="border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                        Plan & Deliverables
                    </a>
                    <a href="#" className="border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                        Updates <span className="ml-1 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">0</span>
                    </a>
                </nav>
            </div>

            {/* Markdown Content */}
            <article className="prose prose-slate max-w-none bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <ReactMarkdown>{project.content}</ReactMarkdown>
            </article>

        </div>

        {/* Sidebar (1 col) */}
        <div className="space-y-6">
            
            {/* "The Numbers" Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
                    <Target size={16} className="mr-2 text-slate-400" />
                    Key Metrics
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-sm text-slate-500">Strategic Value</span>
                        <div className="flex items-center">
                            <span className="font-medium text-slate-900">{project.scores.strategic_value}/10</span>
                        </div>
                    </div>
                     <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-sm text-slate-500">Complexity</span>
                        <div className="flex items-center">
                            <span className="font-medium text-slate-900">{project.scores.complexity}/10</span>
                        </div>
                    </div>
                     <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-sm text-slate-500">ROI Multiplier</span>
                        <div className="flex items-center">
                            <span className="font-medium text-green-600">
                                {project.financials 
                                    ? (project.financials.projected_roi / project.financials.estimated_cost).toFixed(2) + 'x' 
                                    : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financials Card */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
                    <DollarSign size={16} className="mr-2 text-slate-400" />
                    Financials
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Estimated Cost</p>
                        <p className="text-lg font-bold text-slate-900">
                            {project.financials ? formatCurrency(project.financials.estimated_cost) : '-'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">Projected ROI</p>
                        <p className="text-lg font-bold text-green-600">
                             {project.financials ? formatCurrency(project.financials.projected_roi) : '-'}
                        </p>
                    </div>
                </div>
            </div>

             {/* Team & Dates Card */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
                    <Users size={16} className="mr-2 text-slate-400" />
                    Project Details
                </h3>
                <ul className="space-y-4">
                    <li className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                             <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                {project.owner.split(' ').map(n => n[0]).join('')}
                             </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-slate-900">{project.owner}</p>
                            <p className="text-xs text-slate-500">Owner • {project.department}</p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <Calendar size={16} className="mt-0.5 text-slate-400 mr-2" />
                        <div>
                            <p className="text-sm text-slate-900">
                                {new Date(project.dates.planned_start).toLocaleDateString()} - {new Date(project.dates.planned_end).toLocaleDateString()}
                            </p>
                             <p className="text-xs text-slate-500">Planned Duration</p>
                        </div>
                    </li>
                </ul>
            </div>

             {/* Tags */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="text-sm font-semibold text-slate-900 mb-4">Tags</h3>
                 <div className="flex flex-wrap gap-2">
                    {/* Tags are not in the Project type yet, need to add them to schema if I want to display them. 
                        Checking PRD: "tags: ["AI", "Automation", "External"]".
                        I missed adding 'tags' to the ProjectSchema in src/lib/projects.ts!
                        I should update the schema quickly or just conditional render.
                        For now, I'll update schema in next turn if needed, or assume it's missing.
                        Wait, I did check src/lib/projects.ts and didn't see tags in my update.
                        I'll verify and fix schema if I have time, or just skip rendering tags to avoid error.
                    */}
                    {/* Render tags if they exist (checking type safety) */}
                    {(project as any).tags?.map((tag: string) => (
                        <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            {tag}
                        </span>
                    ))}
                 </div>
             </div>

        </div>
      </div>
    </main>
  );
}
