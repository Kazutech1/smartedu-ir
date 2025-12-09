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
      <div className="text-center py-12 text-gray-500">
        No {activeTab} found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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