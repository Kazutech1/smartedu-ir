import React from 'react';
import { SearchResults } from '@/types';
import { TabId } from './Tabs';
import StudentCard from './StudentCard';
import CourseCard from './CourseCard';
import DocumentCard from './DocumentCard';
import { AlertCircle } from 'lucide-react';

interface ResultsListProps {
  results: SearchResults;
  activeTab: TabId;
}

/**
 * ResultsList Component
 * Renders the appropriate result cards based on active tab
 */
export default function ResultsList({ results, activeTab }: ResultsListProps) {
  // Determine which results to display
  const displayResults = {
    students: activeTab === 'students' ? results.students : [],
    courses: activeTab === 'courses' ? results.courses : [],
    documents: activeTab === 'documents' ? results.documents : [],
  };

  const currentResults = displayResults[activeTab];

  // Empty state
  if (currentResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No {activeTab} found
        </h3>
        <p className="text-slate-600 text-center max-w-md">
          Try adjusting your search query or switching to a different search mode.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activeTab === 'students' &&
        results.students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}

      {activeTab === 'courses' &&
        results.courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}

      {activeTab === 'documents' &&
        results.documents.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
    </div>
  );
}