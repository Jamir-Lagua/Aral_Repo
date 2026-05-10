/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Menu, 
  X, 
  Clock, 
  User, 
  Share2, 
  MoreHorizontal,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Course, Lesson, Module } from '@/src/types';

// Mock Data for a Specific Course
const MOCK_COURSE: Course = {
  id: 'archive-001',
  title: "Origins of Aesthetic Philosophy",
  author: "Dr. Elena Vance",
  authorAvatar: "EV",
  description: "A deep dive into the historical roots of beauty, form, and perception from antiquity to the post-modern era.",
  progress: 25,
  totalLessons: 12,
  modules: [
    {
      id: 'm1',
      title: "Foundations of Perception",
      lessons: [
        { id: 'l1', title: "The Platonic Ideal", duration: "45m", isCompleted: true, content: "Lesson content about Plato..." },
        { id: 'l2', title: "Aristotelian Materialism", duration: "1h 12m", isCompleted: true, content: "Lesson content about Aristotle..." },
        { id: 'l3', title: "Kantian Transcendentalism", duration: "55m", isCompleted: false, content: "Lesson content about Kant..." },
      ]
    },
    {
      id: 'm2',
      title: "The Enlightenment Shift",
      lessons: [
        { id: 'l4', title: "Hume's Subjective Turn", duration: "38m", isCompleted: false, content: "Lesson content about Hume..." },
        { id: 'l5', title: "The Sublime vs. The Beautiful", duration: "50m", isCompleted: false, content: "Lesson content about Burke..." },
      ]
    },
    {
      id: 'm3',
      title: "Modern Contradictions",
      lessons: [
        { id: 'l6', title: "Nietzsche and the Dionysian", duration: "1h 05m", isCompleted: false, content: "Lesson content about Nietzsche..." },
        { id: 'l7', title: "Benjamin's Aura in the Age of Replication", duration: "42m", isCompleted: false, content: "Lesson content about Benjamin..." },
      ]
    }
  ]
};

export function CourseViewer({ onBack }: { onBack: () => void }) {
  const [course] = useState<Course>(MOCK_COURSE);
  const [activeLessonId, setActiveLessonId] = useState('l3');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState<string[]>(['m1', 'm2']);

  const activeLesson = course.modules.flatMap(m => m.lessons).find(l => l.id === activeLessonId);
  const totalLessons = course.totalLessons;
  const currentLessonIndex = course.modules.flatMap(m => m.lessons).findIndex(l => l.id === activeLessonId) + 1;

  const toggleModule = (id: string) => {
    setExpandedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const nextLesson = () => {
    const allLessons = course.modules.flatMap(m => m.lessons);
    const currIdx = allLessons.findIndex(l => l.id === activeLessonId);
    if (currIdx < allLessons.length - 1) {
      setActiveLessonId(allLessons[currIdx + 1].id);
    }
  };

  const prevLesson = () => {
    const allLessons = course.modules.flatMap(m => m.lessons);
    const currIdx = allLessons.findIndex(l => l.id === activeLessonId);
    if (currIdx > 0) {
      setActiveLessonId(allLessons[currIdx - 1].id);
    }
  };

  return (
    <div className="flex h-screen bg-aral-cream overflow-hidden">
      {/* Sidebar - Lesson Outline */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 360 : 0 }}
        className={cn(
          "bg-white border-r border-aral-ink/5 flex flex-col overflow-hidden transition-all duration-500",
          !isSidebarOpen && "border-none"
        )}
      >
        <div className="p-8 border-b border-aral-ink/5 flex flex-col gap-6">
            <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-aral-ink/40 hover:text-aral-gold transition-colors">
                <ArrowLeft size={14} /> Back to Archives
            </button>
            <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-aral-ink/30 mb-2">SYLLABUS</h3>
                <h2 className="text-2xl font-black tracking-tighter leading-tight">{course.title}</h2>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {course.modules.map((module) => (
            <div key={module.id} className="space-y-1">
              <button 
                onClick={() => toggleModule(module.id)}
                className="flex items-center justify-between w-full p-4 rounded-2xl hover:bg-aral-cream/50 transition-colors group"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-aral-ink/60">{module.title}</span>
                <ChevronDown 
                    size={14} 
                    className={cn(
                        "text-aral-ink/20 group-hover:text-aral-ink transition-transform duration-300",
                        expandedModules.includes(module.id) ? "rotate-180" : ""
                    )} 
                />
              </button>
              
              <AnimatePresence initial={false}>
                {expandedModules.includes(module.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-1 px-2"
                  >
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLessonId(lesson.id)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-xl transition-all relative group",
                          activeLessonId === lesson.id ? "bg-aral-cream text-aral-ink" : "text-aral-ink/40 hover:bg-aral-cream/30 hover:text-aral-ink/70"
                        )}
                      >
                        {activeLessonId === lesson.id && (
                          <motion.div 
                            layoutId="lesson-indicator"
                            className="absolute left-0 w-1 h-6 bg-aral-gold rounded-full"
                          />
                        )}
                        
                        <div className="flex-1 text-left">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold">{lesson.title}</span>
                                {lesson.isCompleted ? (
                                    <CheckCircle2 size={14} className="text-aral-sage" />
                                ) : (
                                    <span className="text-[9px] font-black opacity-30">{lesson.duration}</span>
                                )}
                            </div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-aral-cream/30 relative">
        {/* Top Header */}
        <header className="bg-white/50 backdrop-blur-md border-b border-aral-ink/5 p-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 hover:bg-aral-ink hover:text-aral-cream rounded-full transition-all"
            >
              <Menu size={20} />
            </button>
            <div className="h-4 w-[1px] bg-aral-ink/10" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-aral-ink/30">
                Lesson {currentLessonIndex} of {totalLessons} · {Math.round((currentLessonIndex/totalLessons)*100)}% Complete
              </span>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-6 h-6 rounded-full bg-aral-ink text-[10px] font-bold text-aral-cream flex items-center justify-center">
                    {course.authorAvatar}
                </div>
                <span className="text-xs font-bold text-aral-ink">{course.author}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 text-aral-ink/40 hover:text-aral-ink transition-colors"><Share2 size={18} /></button>
            <button className="p-3 text-aral-ink/40 hover:text-aral-ink transition-colors"><MoreHorizontal size={18} /></button>
          </div>

          {/* Top Progress Indicator line */}
          <div className="absolute bottom-0 left-0 h-[2px] bg-aral-gold transition-all duration-1000" style={{ width: `${(currentLessonIndex/totalLessons)*100}%` }} />
        </header>

        {/* Lesson Body */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLessonId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-3xl mx-auto py-24 px-8"
            >
              <span className="text-aral-gold font-serif italic text-xl mb-4 block">Lecture ArchivalNode_{activeLessonId.toUpperCase()}</span>
              <h1 className="text-6xl font-black tracking-tighter leading-none mb-12 text-aral-ink">{activeLesson?.title}</h1>
              
              <div className="font-serif-readable text-xl leading-[1.85] text-aral-ink/80 space-y-10">
                <p>
                  The concept of the "Ideal" in aesthetic theory begins not with the object itself, but with the metaphysical distance between the shadow and the source. In this module, we examine how early perceptions of beauty were tied inherently to the divine and the immutable.
                </p>

                <blockquote className="border-l-4 border-aral-gold pl-8 my-16 italic text-2xl text-aral-ink font-serif py-4">
                    "Beauty is the splendor of truth. Not a mere decoration, but the visible radiance of an essential order."
                </blockquote>

                <p>
                  Consider the following theorem of perception: when the observer interacts with form, a synthesis occurs. This is what we call the <code className="bg-aral-gold/10 px-2 py-0.5 rounded text-aral-ink font-mono text-base border border-aral-gold/20">Aral-Synthesis-Event</code>. 
                  It is the moment where raw data becomes wisdom.
                </p>

                <div className="bg-white border border-aral-ink/5 p-10 rounded-[3rem] shadow-sm my-16 space-y-6">
                    <h3 className="text-2xl font-black tracking-tight">Key Inquiries:</h3>
                    <ul className="space-y-4 list-none">
                        {[
                            "How does symmetry influence subconscious trust?",
                            "Can beauty exist independently of an observer?",
                            "The role of entropy in post-modern aesthetic decay."
                        ].map((q, i) => (
                            <li key={i} className="flex gap-4">
                                <span className="text-aral-gold font-black">0{i+1}.</span>
                                <span className="font-sans font-medium text-sm text-aral-ink/60 uppercase tracking-widest">{q}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p>
                    As we move forward, ensure you have reconciled the tension between the physical form and the perceived essence. The next lesson will tackle the shift into materialist critiques.
                </p>
              </div>

              {/* Navigation Bottom */}
              <div className="mt-24 pt-12 border-t border-aral-ink/5 flex items-center justify-between">
                <button 
                    onClick={prevLesson}
                    disabled={currentLessonIndex === 1}
                    className="group flex flex-col items-start gap-1 disabled:opacity-20"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-aral-ink/30 group-hover:text-aral-gold transition-colors">Previous Insight</span>
                    <span className="text-lg font-bold flex items-center gap-2">
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                         Aristotelian Logic
                    </span>
                </button>

                <button 
                    onClick={nextLesson}
                    disabled={currentLessonIndex === totalLessons}
                    className="group flex flex-col items-end gap-1 text-right disabled:opacity-20"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-aral-ink/30 group-hover:text-aral-gold transition-colors">Next Insight</span>
                    <span className="text-lg font-bold flex items-center gap-2">
                         Kant's Sublime
                         <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Mark as Complete Button */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-10 right-10 z-50"
        >
            <button className="relative group bg-aral-gold text-white px-10 py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-2xl shadow-aral-gold/40 active:scale-95 transition-all overflow-hidden">
                <span className="relative z-10 flex items-center gap-3">
                    <CheckCircle2 size={18} />
                    Mark as Complete
                </span>
                <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-white/20 blur-xl pointer-events-none"
                />
            </button>
        </motion.div>
      </main>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(26, 20, 16, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
