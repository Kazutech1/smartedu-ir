'use client';

import React from 'react';
import { Search } from 'lucide-react';
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
    <div className="flex gap-3">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search students, courses, or documents..."
          disabled={isLoading}
          className="w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400 shadow-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Mode Selector */}
      <select
        value={mode}
        onChange={(e) => onModeChange(e.target.value as SearchMode)}
        disabled={isLoading}
        className="px-4 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 bg-white shadow-sm disabled:bg-slate-50 disabled:cursor-not-allowed min-w-[150px]"
      >
        <option value="exact">Exact Match</option>
        <option value="fuzzy">Fuzzy Search</option>
        <option value="all">All Results</option>
      </select>

      {/* Search Button */}
      <button
        onClick={onSearch}
        disabled={isLoading || !query.trim()}
        className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
}