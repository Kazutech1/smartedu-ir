'use client';

import React, { useState } from 'react';
import { BookOpen, Zap, Clock, AlertCircle, Timer, Sparkles, Filter } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import Tabs, { TabId } from '@/components/Tabs';
import ResultsList from '@/components/ResultsList';
import { SearchResults, SearchMode } from '@/types';
import { searchAPI, getTotalResults, getMostPopulatedCategory } from '@/lib/api';

export default function HomePage() {
  // State management
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('fuzzy');
  const [activeTab, setActiveTab] = useState<TabId>('students');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [backendTime, setBackendTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  /**
   * Handle search submission
   */
  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const {
        results: searchResults,
        responseTime: time,
        backendTime: bTime
      } = await searchAPI(query, mode);

      setResults(searchResults);
      setResponseTime(time);
      setBackendTime(bTime);

      // Auto-switch to category with most results
      const mostPopulated = getMostPopulatedCategory(searchResults);
      if (mostPopulated) {
        setActiveTab(mostPopulated);
      } else if (searchResults.students.length > 0) {
        setActiveTab('students');
      } else if (searchResults.courses.length > 0) {
        setActiveTab('courses');
      } else if (searchResults.documents.length > 0) {
        setActiveTab('documents');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.'
      );
      setResults(null);
      setResponseTime(null);
      setBackendTime(null);
    } finally {
      setIsLoading(false);
    }
  };

  const totalResults = results ? getTotalResults(results) : 0;
  const networkLatency = responseTime && backendTime ? responseTime - backendTime : null;

  return (
    <div className="min-h-screen">
      {/* Glass Header */}
      <header className="sticky top-0 z-50 glass backdrop-blur-md bg-white/70 border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">SmartEdU</h1>
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            v2.0 Premium
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* Hero Section */}
        <div className="mb-16 text-center animate-fade-in">
          {!hasSearched && (
            <div className="mb-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-4">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Intelligent Search</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Intelligence.</span>
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Instantly access thousands of students, courses, and documents with our high-performance fuzzy search engine.
              </p>
            </div>
          )}

          <SearchBar
            query={query}
            mode={mode}
            onQueryChange={setQuery}
            onModeChange={setMode}
            onSearch={handleSearch}
            isLoading={isLoading}
          />

          {/* Stats & Metadata - Premium Pill */}
          {hasSearched && !error && results && (
            <div className="inline-flex items-center gap-4 mt-8 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-indigo-100/50 animate-slide-up">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Zap className="w-4 h-4 text-amber-500 fill-current" />
                {totalResults} Results
              </div>
              <div className="w-px h-4 bg-slate-200"></div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Timer className="w-4 h-4 text-indigo-500" />
                {(responseTime || 0)}ms
              </div>
              <div className="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase rounded border border-indigo-100">
                {mode} Mode
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur border border-red-200 rounded-2xl p-6 mb-12 flex items-start gap-4 max-w-2xl mx-auto shadow-lg shadow-red-500/5 animate-fade-in">
            <div className="p-2 bg-red-100 rounded-full shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 text-lg">Search Failed</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State - Premium Spinner */}
        {isLoading && (
          <div className="py-24 text-center">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-lg font-bold text-slate-700 animate-pulse">Searching Knowledge Base...</p>
          </div>
        )}

        {/* Results Display */}
        {!isLoading && results && !error && (
          <div className="mt-8 animate-slide-up">
            <Tabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              studentCount={results.students.length}
              courseCount={results.courses.length}
              documentCount={results.documents.length}
            />
            <div className="mt-6">
              <ResultsList results={results} activeTab={activeTab} />
            </div>
          </div>
        )}

        {/* No Results Message */}
        {!isLoading && hasSearched && !error && results && totalResults === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Filter className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Matches Found</h3>
            <p className="text-slate-500">We couldn't find anything for "{query}".</p>
          </div>
        )}
      </main>

      {/* Footer */}
      {!isLoading && !hasSearched && (
        <footer className="fixed bottom-0 left-0 right-0 py-8 border-t border-slate-100 bg-white/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              SmartEdU • Engineered for Speed
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}