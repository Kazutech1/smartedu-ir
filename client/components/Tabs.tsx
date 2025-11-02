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
    <div className="flex gap-2 border-b border-slate-200">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 font-medium'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}   