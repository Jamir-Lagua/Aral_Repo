/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ArrowRight, Star, Clock, User, Bookmark, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CourseCard } from './CourseCard';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'All Archives',
  'Digital Humanities',
  'Theoretical Physics',
  'Classical Jurisprudence',
  'Avant-Garde Arts',
  'Modern Economics',
  'Cognitive Science'
];

const COURSES: {
  id: number;
  title: string;
  author: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  rating: number;
  category: string;
  imageUrl: string;
  isWide?: boolean;
}[] = [
  {
    id: 1,
    title: "Origins of Aesthetic Philosophy",
    author: "Dr. Elena Vance",
    difficulty: "Advanced",
    duration: "12 hours",
    rating: 4.9,
    category: "Digital Humanities",
    imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800",
    isWide: true
  },
  {
    id: 2,
    title: "Quantum Nexus & String Theory",
    author: "Prof. Aris Thorne",
    difficulty: "Advanced",
    duration: "24 hours",
    rating: 5.0,
    category: "Theoretical Physics",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Roman Civil Law & Jurisprudence",
    author: "Dr. Marcus Aurelius II",
    difficulty: "Intermediate",
    duration: "8 hours",
    rating: 4.7,
    category: "Classical Jurisprudence",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "The Ethics of Artificial Minds",
    author: "Dr. Sarah Chen",
    difficulty: "Advanced",
    duration: "15 hours",
    rating: 4.9,
    category: "Cognitive Science",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
    isWide: true
  },
  {
    id: 5,
    title: "Architectural Phenomenology",
    author: "Lars Van Der Rohe",
    difficulty: "Intermediate",
    duration: "10 hours",
    rating: 4.8,
    category: "Digital Humanities",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    title: "Game Theory in Geopolitics",
    author: "Prof. Julian Barnes",
    difficulty: "Advanced",
    duration: "18 hours",
    rating: 4.6,
    category: "Modern Economics",
    imageUrl: "https://images.unsplash.com/photo-1611974718413-2007412e6e00?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 7,
    title: "Bio-Mimetic Infrastructure",
    author: "Dr. Isabella Medici",
    difficulty: "Intermediate",
    duration: "14 hours",
    rating: 4.7,
    category: "Theoretical Physics",
    imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 8,
    title: "Renaissance Art Synchronicity",
    author: "Dr. Elena Vance",
    difficulty: "Beginner",
    duration: "6 hours",
    rating: 4.8,
    category: "Avant-Garde Arts",
    imageUrl: "https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?auto=format&fit=crop&q=80&w=800"
  }
];

export function LibraryContainer({ onSelectCourse }: { onSelectCourse?: (id: string) => void }) {
  const [activeCategory, setActiveCategory] = useState('All Archives');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const filteredCourses = COURSES.filter(course => {
    const matchesCategory = activeCategory === 'All Archives' || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredCourses = COURSES.filter(c => c.rating >= 4.9);

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Search Header */}
      <div className="mb-16">
        <div className="relative group max-w-2xl">
          <Search className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-500",
            searchQuery ? "text-aral-gold scale-110" : "text-aral-ink/20 group-focus-within:text-aral-gold"
          )} size={24} />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the Aral Archive..." 
            className="w-full h-14 bg-transparent border-none border-b-2 border-aral-ink/5 focus-visible:ring-0 rounded-none text-2xl font-serif italic text-aral-ink placeholder:text-aral-ink/10 pl-10 focus:border-aral-gold transition-all duration-500"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-10 space-y-12">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-aral-ink/30 mb-8">Classification</h4>
              <nav className="flex flex-col gap-6">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onMouseEnter={() => setHoveredCategory(cat)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "relative text-left py-1 text-sm font-bold tracking-tight transition-all",
                      activeCategory === cat ? "text-aral-ink" : "text-aral-ink/40 hover:text-aral-ink/70"
                    )}
                  >
                    <span>{cat}</span>
                    <AnimatePresence>
                      {(activeCategory === cat || hoveredCategory === cat) && (
                        <motion.div
                          layoutId="category-underline"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          exit={{ scaleX: 0 }}
                          className={cn(
                            "absolute bottom-0 left-0 h-[2px] w-full origin-left",
                            activeCategory === cat ? "bg-aral-gold" : "bg-aral-ink/10"
                          )}
                        />
                      )}
                    </AnimatePresence>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8 bg-aral-ink text-aral-cream rounded-[2.5rem] space-y-6 shadow-2xl shadow-aral-ink/20">
               <h5 className="font-serif italic text-xl">Curator's Tip</h5>
               <p className="text-[10px] font-medium leading-relaxed opacity-60 uppercase tracking-widest">
                 "Synthesize your archives often to reveal the unseen connections between disciplines."
               </p>
               <Button className="w-full bg-aral-gold hover:bg-aral-gold/90 text-aral-ink rounded-xl font-bold text-[10px] uppercase tracking-widest h-10">
                 Read Manifesto
               </Button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-16">
          {/* Featured Horizontal Strip */}
          {activeCategory === 'All Archives' && searchQuery === '' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black tracking-tighter">Featured Journals</h3>
                <button className="text-[10px] font-black uppercase tracking-widest text-aral-gold hover:text-aral-ink transition-colors flex items-center gap-2">
                  View Full Selection <ArrowRight size={12} />
                </button>
              </div>
              
              <div className="flex overflow-x-auto pb-10 -mx-4 px-4 scrollbar-hide gap-8">
                {featuredCourses.map((course) => (
                  <div key={`featured-${course.id}`} className="min-w-[450px]">
                    <CourseCard 
                        {...course} 
                        isWide 
                        className="h-full" 
                        onClick={() => onSelectCourse?.(course.id.toString())}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grid View */}
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-aral-ink/5" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-aral-ink/20">The Collective Archive</h4>
              <div className="h-[1px] flex-1 bg-aral-ink/5" />
            </div>

            <motion.div 
               layout
               className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12"
            >
              <AnimatePresence mode="popLayout">
                {filteredCourses.map((course, i) => (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  >
                    <CourseCard 
                        {...course} 
                        onClick={() => onSelectCourse?.(course.id.toString())}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredCourses.length === 0 && (
              <div className="py-32 text-center space-y-6">
                <div className="w-20 h-20 bg-aral-ink/5 rounded-full flex items-center justify-center mx-auto">
                    <Search className="text-aral-ink/10" size={32} />
                </div>
                <h3 className="text-3xl font-serif italic text-aral-ink/20">No matching signals found in the archive</h3>
                <Button 
                    variant="link" 
                    onClick={() => { setActiveCategory('All Archives'); setSearchQuery(''); }}
                    className="text-aral-gold uppercase font-black text-[10px] tracking-widest"
                >
                    Clear Filter Protocol
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
