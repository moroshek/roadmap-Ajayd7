'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Project } from '@/lib/projects';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { STATUS_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ProjectContentProps {
  project: Project;
}

export function ProjectContent({ project }: ProjectContentProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'plan' | 'updates'>('overview');

  // Parse markdown content to extract sections
  const parseContent = () => {
    const content = project.content;
    
    // Extract Executive Summary
    const summaryMatch = content.match(/# Executive Summary\s+([\s\S]*?)(?=##|$)/);
    const executiveSummary = summaryMatch ? summaryMatch[1].trim() : '';
    
    // Extract Deliverables
    const deliverablesMatch = content.match(/## Deliverables\s+([\s\S]*?)(?=##|$)/);
    const deliverables = deliverablesMatch ? deliverablesMatch[1].trim() : '';
    
    return { executiveSummary, deliverables };
  };

  const { executiveSummary, deliverables } = parseContent();

  // Parse deliverables into structured data
  const parseDeliverables = () => {
    if (!deliverables) return [];
    
    const lines = deliverables.split('\n');
    return lines
      .filter(line => line.trim().startsWith('- ['))
      .map(line => {
        const isComplete = line.includes('[x]') || line.includes('[X]');
        const text = line.replace(/- \[[x ]\]/i, '').trim();
        return { text, isComplete };
      });
  };

  const deliverablesList = parseDeliverables();
  const completedCount = deliverablesList.filter(d => d.isComplete).length;
  const totalCount = deliverablesList.length;

  return (
    <>
      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-all",
                activeTab === 'overview'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
            )}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-all flex items-center gap-2",
                activeTab === 'plan'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
            )}
          >
            Plan & Deliverables
            {totalCount > 0 && (
              <span className={cn(
                  "py-0.5 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider",
                  activeTab === 'plan' ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-400"
              )}>
                {completedCount}/{totalCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('updates')}
            className={cn(
                "whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-all flex items-center gap-2",
                activeTab === 'updates'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'
            )}
          >
            Updates
            <span className={cn(
                "py-0.5 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider",
                activeTab === 'updates' ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-400"
            )}>0</span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <article className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                Executive Summary
            </h2>
            {executiveSummary ? (
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                <ReactMarkdown>{executiveSummary}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-slate-400 italic font-medium">No executive summary available for this strategic initiative.</p>
            )}
          </article>
        )}

        {activeTab === 'plan' && (
          <div className="space-y-6">
            {/* Progress Overview */}
            {totalCount > 0 && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Deliverables Progress</h3>
                    <p className="text-xs text-slate-500 font-medium">Execution tracking for current milestone</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-indigo-600 leading-none">
                      {Math.round((completedCount / totalCount) * 100)}%
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Completion Score</div>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-indigo-600">{completedCount} ACHIEVED</span>
                  <span className="text-slate-400">{totalCount - completedCount} REMAINING</span>
                </div>
              </div>
            )}

            {/* Deliverables List */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                Milestone Artifacts
              </h2>
              {deliverablesList.length > 0 ? (
                <div className="space-y-3">
                  {deliverablesList.map((deliverable, index) => (
                    <div
                      key={index}
                      className={cn(
                          "flex items-start gap-3 p-4 rounded-xl border transition-all",
                          deliverable.isComplete
                            ? 'bg-emerald-50/50 border-emerald-100 group'
                            : 'bg-slate-50 border-slate-100 hover:border-indigo-200'
                      )}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {deliverable.isComplete ? (
                          <CheckCircle2 size={20} className="text-emerald-500" />
                        ) : (
                          <Circle size={20} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={cn(
                              "text-sm font-bold transition-all",
                              deliverable.isComplete
                                ? 'text-emerald-700/60 line-through'
                                : 'text-slate-700'
                          )}
                        >
                          {deliverable.text}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span
                          className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest leading-none border",
                              deliverable.isComplete
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                : 'bg-white text-slate-400 border-slate-200'
                          )}
                        >
                          {deliverable.isComplete ? 'ACHIEVED' : 'PENDING'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic font-medium">No strategic deliverables registered for this phase.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'updates' && (
          <article className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-200 mb-6 border border-slate-100">
              <Clock size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Syncing Project Timeline</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">Real-time updates and change logs will be available once the steering committee verifies the latest milestone report.</p>
          </article>
        )}
      </div>
    </>
  );
}
