'use client';

import React from 'react';
import { Search, Command, ArrowRight } from 'lucide-react';
import { SearchMode } from '@/types';

interface SearchBarProps {
  query: string;
  mode: SearchMode;
  onQueryChange: (query: string) => void;
  onModeChange: (mode: SearchMode) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

/**
 * SearchBar Component
 * Handles user input for search queries and mode selection
 */
export default function SearchBar({
  query,
  mode,
  onQueryChange,
  onModeChange,
  onSearch,
  isLoading = false,
}: SearchBarProps) {
  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      onSearch();
    }
  };

  return (
    <div className="flex gap-4 w-full max-w-3xl mx-auto animate-fade-in relative z-10">
      <div className="flex-1 relative group">
        <div className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center">
          <Search className="w-6 h-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search students, courses, or docs..."
          disabled={isLoading}
          className="w-full pl-14 pr-4 h-16 bg-white border-2 border-slate-100 rounded-2xl text-lg font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium shadow-xl shadow-indigo-100/40 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md text-xs font-bold text-slate-500 border border-slate-200">
          <Command className="w-3 h-3" /> K
        </div>
      </div>

      <div className="hidden sm:flex relative">
        <select
          value={mode}
          onChange={(e) => onModeChange(e.target.value as SearchMode)}
          disabled={isLoading}
          className="appearance-none h-16 w-40 pl-5 pr-10 bg-white border-2 border-slate-100 rounded-2xl text-slate-700 font-bold shadow-xl shadow-indigo-100/40 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 cursor-pointer transition-all hover:bg-slate-50"
        >
          <option value="exact">Exact</option>
          <option value="fuzzy">Fuzzy</option>
          <option value="all">Deep</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-500">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 4.5L6 8L9.5 4.5" />
          </svg>
        </div>
      </div>

      <button
        onClick={onSearch}
        disabled={isLoading || !query.trim()}
        className="h-16 px-8 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-600/40 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 transition-all flex items-center gap-2"
      >
        <span>Search</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}