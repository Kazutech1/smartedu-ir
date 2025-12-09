import React from 'react';
import { GraduationCap, Calendar } from 'lucide-react';
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
    <div className="relative group p-6 bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 h-full">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
            {student.firstName.charAt(0)}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors">
              <span dangerouslySetInnerHTML={{ __html: student.firstName }} />{' '}
              <span dangerouslySetInnerHTML={{ __html: student.lastName }} />
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <GraduationCap className="w-3 h-3 text-slate-400" />
              <p className="text-xs font-bold text-slate-500 font-mono">
                <span dangerouslySetInnerHTML={{ __html: student.studentNumber }} />
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4 bg-slate-50/50 rounded-xl border border-slate-100/50">
        {student.email && (
          <div className="flex items-center gap-3 text-slate-600 text-sm group-hover:text-slate-900 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
            <span className="truncate font-medium opacity-80" dangerouslySetInnerHTML={{ __html: student.email }} />
          </div>
        )}

        {student.dateOfBirth && (
          <div className="flex items-center gap-3 text-slate-500 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Born: <span dangerouslySetInnerHTML={{ __html: student.dateOfBirth }} /></span>
          </div>
        )}
      </div>
    </div>
  );
}