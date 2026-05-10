/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Flashcard } from '@/src/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Rotate3d, SquareStack, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface FlashcardViewProps {
  flashcards: Flashcard[];
}

export function FlashcardView({ flashcards }: FlashcardViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flashcards.length) return null;

  const currentCard = flashcards[currentIndex];

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  return (
    <div className="p-10 h-full flex flex-col max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full w-fit">
            <SquareStack size={12} className="text-amber-600" />
            <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">
              Revision Vault
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
            Card {currentIndex + 1} of {flashcards.length}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="perspective-1000 w-full max-w-lg aspect-[3/2] relative group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
          <motion.div
            className="w-full h-full relative transition-all duration-500 preserve-3d"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
          >
            {/* Front */}
            <div className="absolute inset-0 w-full h-full backface-hidden bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center p-12 text-center overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(249,250,251,1),transparent)]" />
               <div className="relative z-10 space-y-6">
                 <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto text-indigo-400 mb-2">
                    <Sparkles size={24} />
                 </div>
                 <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                   {currentCard.front}
                 </h2>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Click to Reveal Synthesis</p>
               </div>
            </div>

            {/* Back */}
            <div 
              className="absolute inset-0 w-full h-full backface-hidden bg-indigo-900 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center text-white"
              style={{ transform: 'rotateY(180deg)' }}
            >
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Rotate3d size={120} />
               </div>
               <div className="relative z-10 space-y-4">
                 <div className="px-4 py-1.5 bg-white/10 rounded-full w-fit mx-auto border border-white/10">
                   <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Insight Discovery</span>
                 </div>
                 <p className="text-xl font-medium leading-relaxed italic text-indigo-50">
                    {currentCard.back}
                 </p>
               </div>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-6 mt-12">
            <Button 
                variant="outline" 
                size="icon" 
                onClick={(e) => { e.stopPropagation(); prevCard(); }}
                className="h-14 w-14 rounded-2xl border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-slate-50 transition-all shadow-sm"
            >
                <ChevronLeft size={24} />
            </Button>
            
            <Button 
                onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}
                className="h-14 bg-slate-900 rounded-2xl px-10 font-black text-sm tracking-tight shadow-xl hover:bg-slate-800 flex items-center gap-3 active:scale-95 transition-all"
            >
                <Rotate3d size={18} />
                Flip Card
            </Button>

            <Button 
                variant="outline" 
                size="icon" 
                onClick={(e) => { e.stopPropagation(); nextCard(); }}
                className="h-14 w-14 rounded-2xl border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-slate-50 transition-all shadow-sm"
            >
                <ChevronRight size={24} />
            </Button>
        </div>
      </div>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
}
