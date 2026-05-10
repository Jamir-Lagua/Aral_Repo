/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, FileText, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db, auth } from '@/src/lib/firebase';
import { cn } from '@/lib/utils';

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<{ notes: any[], tasks: any[] }>({ notes: [], tasks: [] });
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        handleSearch();
      } else {
        setResults({ notes: [], tasks: [] });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      // Notes Search
      const notesQ = query(
        collection(db, 'notes'),
        where('userId', '==', auth.currentUser.uid),
        limit(5)
      );
      const notesSnap = await getDocs(notesQ);
      const notesResults = notesSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((n: any) => n.title.toLowerCase().includes(searchTerm.toLowerCase()));

      // Tasks Search
      const tasksQ = query(
        collection(db, 'tasks'),
        where('userId', '==', auth.currentUser.uid),
        limit(5)
      );
      const tasksSnap = await getDocs(tasksQ);
      const tasksResults = tasksSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((t: any) => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

      setResults({ notes: notesResults, tasks: tasksResults });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative group w-48 lg:w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-50 transition-colors" />
        <Input
          placeholder="Cmd + K to search..."
          onClick={() => setIsOpen(true)}
          readOnly
          className="w-full h-9 pl-9 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 text-[10px] rounded-xl cursor-text font-bold uppercase tracking-widest text-slate-400"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                <Search className="text-indigo-600" size={24} />
                <Input
                  autoFocus
                  placeholder="Query A.R.A.L. Central Archive..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-none focus-visible:ring-0 text-xl font-bold placeholder:text-slate-200 h-auto p-0"
                />
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                   <X size={20} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-4 space-y-8">
                {loading && (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-300" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Synchronizing Archive...</p>
                  </div>
                )}

                {!loading && (results.notes.length > 0 || results.tasks.length > 0) ? (
                  <>
                    {results.notes.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Study Materials</h4>
                        <div className="grid gap-1">
                          {results.notes.map((note) => (
                            <button
                              key={note.id}
                              onClick={() => { /* Navigation logic */ setIsOpen(false); }}
                              className="w-full text-left p-4 rounded-2xl hover:bg-indigo-50 group flex items-center justify-between transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                  <FileText size={18} />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-700 group-hover:text-indigo-900">{note.title}</p>
                                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Note Milestone</p>
                                </div>
                              </div>
                              <ChevronRight size={16} className="text-slate-200 group-hover:text-indigo-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {results.tasks.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Planner Objective</h4>
                        <div className="grid gap-1">
                          {results.tasks.map((task) => (
                            <button
                                key={task.id}
                                onClick={() => { setIsOpen(false); }}
                                className="w-full text-left p-4 rounded-2xl hover:bg-emerald-50 group flex items-center justify-between transition-all"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="p-2 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <CheckCircle2 size={18} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-700 group-hover:text-emerald-900">{task.title}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Task Protocol</p>
                                  </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-200 group-hover:text-emerald-400" />
                              </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : !loading && searchTerm.length >= 2 ? (
                  <div className="py-20 text-center space-y-4">
                    <p className="text-lg font-black text-slate-200 uppercase tracking-tighter italic">"No Signal Detected in Archive"</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Try adjusting your query protocol</p>
                  </div>
                ) : !loading && (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                             <Search className="text-slate-200" size={32} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enter a query to begin synchronization</p>
                    </div>
                )}
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-10">
                 <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 shadow-sm">ESC</kbd>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">To Close</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 shadow-sm">↑↓</kbd>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">To Navigate</span>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
