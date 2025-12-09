import React from 'react';
import { FileText, FolderOpen } from 'lucide-react';
import { Document } from '@/types';

interface DocumentCardProps {
  document: Document;
}

/**
 * DocumentCard Component
 * Displays individual document search result with HTML highlighting
 */
export default function DocumentCard({ document }: DocumentCardProps) {
  return (
    <div className="relative group p-6 bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 h-full flex flex-col">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 shrink-0 shadow-sm">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-[10px] font-extrabold text-rose-600 uppercase tracking-wider mb-0.5">Document</span>
          <h3 className="font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors text-lg break-words">
            <span dangerouslySetInnerHTML={{ __html: document.filename }} />
          </h3>
        </div>
      </div>

      <div className="flex-1 text-sm text-slate-600 mb-5 bg-slate-50 p-3 rounded-lg border border-slate-100/50">
        <span className="line-clamp-3 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: `...${document.snippet}...` }} />
      </div>

      {document.filePath && (
        <div className="pt-3 border-t border-slate-50 mt-auto">
          <p className="text-xs text-slate-400 truncate flex items-center gap-2 font-mono">
            <FolderOpen className="w-3 h-3 text-slate-300" />
            {document.filePath}
          </p>
        </div>
      )}
    </div>
  );
}