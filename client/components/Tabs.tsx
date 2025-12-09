'use client';

import React from 'react';
import { Users, BookOpen, FileText, LucideIcon } from 'lucide-react';

export type TabId = 'students' | 'courses' | 'documents';

interface Tab {
  id: TabId;
  label: string;
  icon: LucideIcon;
  count: number;
}

interface TabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  studentCount: number;
  courseCount: number;
  documentCount: number;
}

/**
 * Tabs Component
 * Displays category tabs with result counts
 */
export default function Tabs({
  activeTab,
  onTabChange,
  studentCount,
  courseCount,
  documentCount,
}: TabsProps) {
  const tabs: Tab[] = [
    { id: 'students', label: 'Students', icon: Users, count: studentCount },
    { id: 'courses', label: 'Courses', icon: BookOpen, count: courseCount },
    { id: 'documents', label: 'Documents', icon: FileText, count: documentCount },
  ];

  return (
    <div className="flex gap-3 justify-center mb-10 w-full overflow-x-auto pb-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative group flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300
              ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                : 'bg-white text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100'
              }
            `}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-2' : ''}`} />
            <span className="font-bold tracking-tight">{tab.label}</span>
            {tab.count >= 0 && (
              <span className={`
                flex items-center justify-center h-6 min-w-[1.5rem] text-xs font-bold px-1.5 rounded-md
                ${isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700'
                }
              `}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}