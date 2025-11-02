'use client';

import React, { useState } from 'react';
import { BookOpen, Zap, Clock, AlertCircle, Timer } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">SmartEdU</h1>
              <p className="text-sm text-slate-600">
                Academic Information Retrieval System
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar
            query={query}
            mode={mode}
            onQueryChange={setQuery}
            onModeChange={setMode}
            onSearch={handleSearch}
            isLoading={isLoading}
          />

          {/* Search Statistics */}
          {hasSearched && !error && results && (
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-600">
              {/* Total Results */}
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="font-medium">
                  {totalResults} {totalResults === 1 ? 'result' : 'results'}
                </span>
              </div>

              {/* Backend Processing Time */}
              {backendTime !== null && (
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-blue-500" />
                  <span>
                    Backend:{' '}
                    <span className="font-medium text-slate-900">
                      {backendTime}ms
                    </span>
                  </span>
                </div>
              )}

              {/* Total Response Time */}
              {responseTime !== null && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>
                    Total:{' '}
                    <span className="font-medium text-slate-900">
                      {responseTime}ms
                    </span>
                  </span>
                </div>
              )}

              {/* Network Latency */}
              {networkLatency !== null && networkLatency > 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>
                    (Network: {networkLatency}ms)
                  </span>
                </div>
              )}

              {/* Search Mode Indicator */}
              <div className="ml-auto flex items-center gap-2 text-xs">
                <span className="text-slate-500">Mode:</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">
                Search Error
              </h3>
              <p className="text-sm text-red-700">{error}</p>
              <p className="text-xs text-red-600 mt-2">
                Make sure your backend server is running on{' '}
                <code className="bg-red-100 px-1 py-0.5 rounded">
                  http://localhost:5000
                </code>
              </p>
            </div>
          </div>
        )}

        {/* Welcome State (before first search) */}
        {!hasSearched && !isLoading && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Welcome to SmartEdU
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto mb-6">
              Search for students, courses, and documents using our advanced
              information retrieval system. Choose between exact matching,
              fuzzy search, or view all results.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Exact Match: Precise keyword search</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Fuzzy Search: Tolerance for typos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>All Results: Comprehensive view</span>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-600">Searching academic database...</p>
            <p className="text-xs text-slate-500 mt-2">
              Query: "{query}" • Mode: {mode}
            </p>
          </div>
        )}

        {/* Results Display */}
        {!isLoading && results && !error && (
          <>
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
          </>
        )}

        {/* No Results Message */}
        {!isLoading && hasSearched && !error && results && totalResults === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No results found
            </h3>
            <p className="text-slate-600 max-w-md mx-auto mb-4">
              No students, courses, or documents matched your search for "{query}"
            </p>
            <p className="text-sm text-slate-500">
              Try adjusting your search query or switching to a different search mode.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-16 py-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-600">
          <p>
            SmartEdU Information Retrieval System • Built with Next.js 14 &
            Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}