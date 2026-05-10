/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';

import { ResourceSuggestion } from '@/src/types';
import { ExternalLink, Video, BookOpen, FileText as FileIcon } from 'lucide-react';

interface AISummaryProps {
  summary: string;
  isLoading?: boolean;
  resources?: ResourceSuggestion[];
}

export function AISummary({ summary, isLoading, resources }: AISummaryProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-blue-500">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="font-medium animate-pulse">Analyzing notes and generating summary...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
        <p className="max-w-xs">Click the "Summarize" button to generate an AI-powered summary of your notes.</p>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight">AI Study Summary</h3>
      </div>
      
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-sm leading-relaxed text-slate-700">
        <div className="bg-indigo-600/5 border border-indigo-100 rounded-xl p-4 mb-10 flex items-center gap-4">
           <div className="p-2 bg-indigo-600 rounded-lg text-white">
             <Sparkles size={18} />
           </div>
           <div>
             <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-900">A.R.A.L. Assistant</p>
             <p className="text-xs text-indigo-700">Synthesized insights from your notes</p>
           </div>
        </div>

        <div className="prose prose-indigo max-w-none prose-sm sm:prose-base 
          prose-headings:text-indigo-900 prose-headings:font-bold prose-headings:tracking-tight
          prose-p:text-slate-600 prose-p:leading-8
          prose-li:text-slate-600 prose-li:marker:text-indigo-400 prose-li:marker:font-bold
          prose-strong:text-indigo-800 prose-strong:font-bold">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Keyword Extraction</h4>
          <div className="flex flex-wrap gap-2">
            {["Analysis", "Core Theme", "Study Point", "Reference"].map((kw, i) => (
              <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-indigo-900 shadow-sm">
                {kw}
              </span>
            ))}
          </div>
        </div>

        {resources && resources.length > 0 && (
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-1 h-8 bg-indigo-600 rounded-full" />
               <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Recommended Discovery</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {resources.map((res, i) => (
                 <a 
                   key={i} 
                   href={res.url.startsWith('http') ? res.url : `https://www.google.com/search?q=${encodeURIComponent(res.title)}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="group p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300"
                 >
                   <div className="bg-slate-50 p-2.5 rounded-xl w-fit mb-4 group-hover:bg-indigo-50 transition-colors">
                      {res.type === 'video' && <Video size={18} className="text-red-400 group-hover:text-red-500" />}
                      {res.type === 'article' && <BookOpen size={18} className="text-blue-400 group-hover:text-blue-500" />}
                      {res.type === 'book' && <FileIcon size={18} className="text-amber-400 group-hover:text-amber-500" />}
                   </div>
                   <h5 className="font-bold text-slate-900 text-sm mb-2 group-hover:text-indigo-600 transition-colors leading-tight">{res.title}</h5>
                   <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3">{res.description}</p>
                   <div className="mt-4 flex items-center justify-between">
                      <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400">{res.type}</span>
                      <ExternalLink size={12} className="text-slate-300 group-hover:text-indigo-400" />
                   </div>
                 </a>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { Sparkles } from 'lucide-react';
