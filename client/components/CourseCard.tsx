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
    <div className="relative group p-6 bg-white rounded-xl border-2 border-slate-100 hover:border-orange-200 transition-colors duration-200 h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-extrabold text-orange-600 uppercase tracking-wider mb-0.5">Course</span>
            <span className="text-sm font-bold text-slate-900 font-mono bg-slate-50 px-2 py-0.5 rounded">
              <span dangerouslySetInnerHTML={{ __html: course.code }} />
            </span>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
        <span dangerouslySetInnerHTML={{ __html: course.title }} />
      </h3>

      {course.description && (
        <p className="text-sm text-slate-500 mb-4 line-clamp-3 leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: course.description }} />
        </p>
      )}

      {course.credits && (
        <div className="flex items-center gap-2 pt-4 border-t border-slate-50 mt-auto">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-300"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{course.credits} Credits</span>
        </div>
      )}
    </div>
  );
}