import React from 'react';
import { FileText } from 'lucide-react';
import { Document } from '@/types';

interface DocumentCardProps {
  document: Document;
}

/**
 * DocumentCard Component
 * Displays document search result with snippet preview and HTML highlighting
 */
export default function DocumentCard({ document }: DocumentCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-all animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 mb-2 break-words">
            <span dangerouslySetInnerHTML={{ __html: document.filename }} />
          </h3>
          <div className="text-sm text-slate-600 leading-relaxed">
            <span
              className="line-clamp-3"
              dangerouslySetInnerHTML={{ __html: `...${document.snippet}...` }}
            />
          </div>
          {document.filePath && (
            <p className="text-xs text-slate-400 mt-2 truncate">
              Path: {document.filePath}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}