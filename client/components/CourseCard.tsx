import React from 'react';
import { BookOpen } from 'lucide-react';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
}

/**
 * CourseCard Component
 * Displays individual course search result with HTML highlighting
 */
export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            <span dangerouslySetInnerHTML={{ __html: course.title }} />
          </h3>
          <p className="text-sm text-slate-600">
            Course Code:{' '}
            <span dangerouslySetInnerHTML={{ __html: course.code }} />
          </p>
          {course.description && (
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              <span dangerouslySetInnerHTML={{ __html: course.description }} />
            </p>
          )}
          {course.credits && (
            <p className="text-xs text-slate-400 mt-1">
              Credits: {course.credits}
            </p>
          )}
        </div>
        <div className="ml-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}