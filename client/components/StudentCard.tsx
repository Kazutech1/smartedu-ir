import React from 'react';
import { Users } from 'lucide-react';
import { Student } from '@/types';

interface StudentCardProps {
  student: Student;
}

/**
 * StudentCard Component
 * Displays individual student search result with HTML highlighting
 */
export default function StudentCard({ student }: StudentCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            {/* Render firstName with potential <mark> tags */}
            <span dangerouslySetInnerHTML={{ __html: student.firstName }} />{' '}
            <span dangerouslySetInnerHTML={{ __html: student.lastName }} />
          </h3>
          <p className="text-sm text-slate-600">
            Student Number:{' '}
            <span dangerouslySetInnerHTML={{ __html: student.studentNumber }} />
          </p>
          {student.email && (
            <p className="text-sm text-slate-500 mt-1">
              <span dangerouslySetInnerHTML={{ __html: student.email }} />
            </p>
          )}
          {student.dateOfBirth && (
            <p className="text-xs text-slate-400 mt-1">
              DOB: <span dangerouslySetInnerHTML={{ __html: student.dateOfBirth }} />
            </p>
          )}
        </div>
        <div className="ml-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
}