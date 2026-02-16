'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Project } from '@/lib/projects';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

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
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'plan'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Plan & Deliverables
            {totalCount > 0 && (
              <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">
                {completedCount}/{totalCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('updates')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'updates'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Updates
            <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">0</span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <article className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Executive Summary</h2>
            {executiveSummary ? (
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown>{executiveSummary}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-slate-500 italic">No executive summary available.</p>
            )}
          </article>
        )}

        {activeTab === 'plan' && (
          <div className="space-y-6">
            {/* Progress Overview */}
            {totalCount > 0 && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Deliverables Progress</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">
                      {Math.round((completedCount / totalCount) * 100)}%
                    </div>
                    <div className="text-xs text-slate-500">Complete</div>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                  <span>{completedCount} of {totalCount} completed</span>
                  <span>{totalCount - completedCount} remaining</span>
                </div>
              </div>
            )}

            {/* Deliverables List */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Deliverables</h2>
              {deliverablesList.length > 0 ? (
                <div className="space-y-3">
                  {deliverablesList.map((deliverable, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                        deliverable.isComplete
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-slate-50 border-slate-200 hover:border-indigo-200'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {deliverable.isComplete ? (
                          <CheckCircle2 size={20} className="text-emerald-600" />
                        ) : (
                          <Circle size={20} className="text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            deliverable.isComplete
                              ? 'text-emerald-900 line-through'
                              : 'text-slate-900'
                          }`}
                        >
                          {deliverable.text}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                            deliverable.isComplete
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {deliverable.isComplete ? 'Complete' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">No deliverables defined.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'updates' && (
          <article className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-center py-12">
              <Clock size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Updates Yet</h3>
              <p className="text-slate-500">Project updates will appear here as they are added.</p>
            </div>
          </article>
        )}
      </div>
    </>
  );
}
