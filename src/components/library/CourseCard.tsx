/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Bookmark, Star, Clock, User, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface CourseCardProps {
  title: string;
  author: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  rating: number;
  imageUrl?: string;
  imageGradient?: string;
  isWide?: boolean;
  className?: string;
  onClick?: () => void;
}

export function CourseCard({ 
  title, 
  author, 
  difficulty, 
  duration, 
  rating, 
  imageUrl,
  imageGradient,
  isWide = false,
  className,
  onClick
}: CourseCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Parallax Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "group relative bg-white rounded-[2.5rem] border border-aral-ink/5 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer h-[480px]",
        isWide ? "md:col-span-2" : "col-span-1",
        className
      )}
    >
      {/* Background Image / Gradient */}
      <div className="absolute inset-0 z-0">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000"
          />
        ) : (
          <div 
            className="w-full h-full opacity-40 group-hover:opacity-60 transition-opacity duration-700"
            style={{ background: imageGradient }}
          />
        )}
        {/* Subtle Brand Tint */}
        <div className="absolute inset-0 bg-aral-cream/20 mix-blend-multiply" />
      </div>
      
      <div className="relative z-10 h-full flex flex-col p-10">
        <div className="flex items-start justify-between">
          <div className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-aral-ink/10 backdrop-blur-md",
            difficulty === 'Beginner' ? "bg-emerald-50/80 text-emerald-700 border-emerald-100" :
            difficulty === 'Intermediate' ? "bg-aral-gold/10 text-aral-gold border-aral-gold/20" :
            "bg-red-50/80 text-red-700 border-red-100"
          )}>
            {difficulty}
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); setIsBookmarked(!isBookmarked); }}
            className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all backdrop-blur-sm",
                isBookmarked ? "bg-aral-gold text-white shadow-lg shadow-aral-gold/30" : "bg-white/50 text-aral-ink/40 hover:text-aral-gold hover:bg-white"
            )}
          >
            <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="mt-auto space-y-6">
          <div className="flex items-center gap-2 text-aral-ink/60 text-[10px] font-bold uppercase tracking-widest bg-white/40 backdrop-blur-sm w-fit px-4 py-1.5 rounded-full border border-white/10">
            <User size={12} className="text-aral-gold" />
            <span>{author}</span>
          </div>
          
          <h3 className={cn(
            "font-serif font-black tracking-tighter text-aral-ink group-hover:text-aral-gold transition-colors leading-[0.9]",
            isWide ? "text-5xl md:text-6xl" : "text-4xl"
          )}>
            {title}
          </h3>
          
          <div className="pt-8 flex items-center justify-between border-t border-aral-ink/10">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-aral-ink/60">
                    <Clock size={16} className="text-aral-gold" />
                    <span className="text-[11px] font-bold">{duration}</span>
                </div>
                <div className="flex items-center gap-2 text-aral-ink/60">
                    <Star size={16} className="text-aral-gold fill-aral-gold" />
                    <span className="text-[11px] font-bold">{rating}</span>
                </div>
            </div>
            
            <div className="w-12 h-12 bg-aral-ink text-aral-cream rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all shadow-xl shadow-aral-ink/20">
                <ChevronRight size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative vertical mask for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-aral-cream via-aral-cream/40 to-transparent opacity-80 pointer-events-none" />
    </motion.div>
  );
}
