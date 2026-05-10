/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft, 
  GraduationCap, 
  Sparkles, 
  Target, 
  Zap, 
  Brain, 
  Clock, 
  Trophy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface OnboardingFlowProps {
  onComplete: (data: any) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left
  const [formData, setFormData] = useState({
    purpose: '',
    interests: [] as string[],
    timeCommitment: 30,
    learningStyle: ''
  });

  const totalSteps = 6;

  const nextStep = () => {
    if (step < totalSteps) {
      setDirection(1);
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  useEffect(() => {
    if (step === 6) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, colors: ['#C9A84C', '#F5F0E8', '#1A1410'] };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [step]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="fixed inset-0 bg-aral-ink text-aral-cream flex flex-col z-[100] overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          className="h-full bg-aral-gold shadow-[0_0_10px_rgba(201,168,76,0.5)]"
        />
      </div>

      {/* Back Button */}
      {step > 1 && step < totalSteps && (
        <button 
          onClick={prevStep}
          className="absolute top-8 left-8 p-4 hover:bg-white/5 rounded-full transition-all group z-50"
        >
          <ArrowLeft size={24} className="text-aral-cream/40 group-hover:text-aral-gold transition-colors" />
        </button>
      )}

      {/* Main Content */}
      <div className="flex-1 relative flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="w-full max-w-4xl px-8 focus:outline-none"
          >
            {step === 1 && (
              <div className="text-center space-y-12">
                <motion.div 
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ duration: 1, ease: "easeOut" }}
                   className="flex justify-center"
                >
                    <div className="w-32 h-32 bg-aral-gold rounded-[2.5rem] flex items-center justify-center transform rotate-12 shadow-2xl shadow-aral-gold/20">
                        <GraduationCap size={64} className="text-aral-ink" />
                    </div>
                </motion.div>
                
                <div className="space-y-6">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-7xl font-serif italic tracking-tighter"
                  >
                    Aral
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-[10px] font-black uppercase tracking-[0.5em] text-aral-gold"
                  >
                    Mastery Awaits You
                  </motion.p>
                </div>

                <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 1.2 }}
                >
                    <Button 
                        onClick={nextStep}
                        className="bg-aral-gold hover:bg-aral-gold/90 text-aral-ink px-12 h-16 rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl shadow-aral-gold/10"
                    >
                        Begin Your Initiation
                    </Button>
                </motion.div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-16">
                <div className="space-y-4 text-center">
                    <h2 className="text-5xl font-serif italic text-aral-cream tracking-tight">What brings you to Aral?</h2>
                    <p className="text-aral-gold/40 text-[10px] font-black uppercase tracking-[0.3em]">Define Your Intent</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { id: 'academic', title: 'Academic Excellence', icon: Target, desc: 'Master course materials and ace examinations through focused synthesis.' },
                        { id: 'professional', title: 'Professional Growth', icon: Zap, desc: 'Acquire high-value skills for the modern intellectual economy.' },
                        { id: 'polymathy', title: 'Deep Polymathy', icon: Brain, desc: 'Connect disparate disciplines and build a personal archive of wisdom.' },
                        { id: 'curiosity', title: 'Innate Curiosity', icon: Sparkles, desc: 'Explore the vast wonders of history, art, and science for pure joy.' },
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => { setFormData({...formData, purpose: opt.id}); nextStep(); }}
                            className={cn(
                                "flex items-start gap-6 p-8 rounded-[2rem] text-left transition-all group border-2",
                                formData.purpose === opt.id 
                                    ? "bg-aral-gold/10 border-aral-gold shadow-[0_0_30px_rgba(201,168,76,0.15)] scale-[1.02]" 
                                    : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
                            )}
                        >
                            <div className={cn(
                                "p-4 rounded-xl transition-colors",
                                formData.purpose === opt.id ? "bg-aral-gold text-aral-ink" : "bg-white/5 text-aral-gold/40 group-hover:text-aral-gold"
                            )}>
                                <opt.icon size={24} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xl font-bold tracking-tight">{opt.title}</h4>
                                <p className="text-xs text-aral-cream/40 leading-relaxed font-medium">{opt.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-16 text-center">
                <div className="space-y-4">
                    <h2 className="text-5xl font-serif italic text-aral-cream tracking-tight">Select your fields of interest</h2>
                    <p className="text-aral-gold/40 text-[10px] font-black uppercase tracking-[0.3em]">Mapping Your Intellectual Coordinates</p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
                    {[
                        'History', 'Physics', 'Aesthetics', 'Law', 'Economics', 
                        'Biology', 'Linguistics', 'Music Theory', 'Philosophy', 
                        'Architecture', 'Logic', 'Neuroscience', 'Literature'
                    ].map((tag) => {
                        const isSelected = formData.interests.includes(tag);
                        return (
                            <button
                                key={tag}
                                onClick={() => {
                                    const newInterests = isSelected 
                                        ? formData.interests.filter(i => i !== tag)
                                        : [...formData.interests, tag];
                                    setFormData({...formData, interests: newInterests});
                                }}
                                className={cn(
                                    "px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all border-2",
                                    isSelected 
                                        ? "bg-aral-gold border-aral-gold text-aral-ink scale-110 shadow-lg shadow-aral-gold/20" 
                                        : "bg-white/5 border-white/10 text-aral-cream/60 hover:border-aral-gold/40 hover:text-aral-gold"
                                )}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>

                <div className="pt-10">
                    <Button 
                        disabled={formData.interests.length === 0}
                        onClick={nextStep}
                        className="bg-aral-gold text-aral-ink hover:bg-aral-gold/90 px-16 h-14 rounded-full font-black uppercase tracking-widest text-[10px]"
                    >
                        Confirm Selection
                    </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-20 text-center">
                <div className="space-y-4">
                    <h2 className="text-5xl font-serif italic text-aral-cream tracking-tight">Establish your rhythm</h2>
                    <p className="text-aral-gold/40 text-[10px] font-black uppercase tracking-[0.3em]">Daily Temporal Dedication</p>
                </div>

                <div className="max-w-xl mx-auto space-y-12">
                    <div className="text-8xl font-black text-aral-gold tracking-tighter flex items-end justify-center gap-4">
                        {formData.timeCommitment} <span className="text-2xl font-serif italic mb-4 opacity-40">min/day</span>
                    </div>
                    
                    <div className="relative h-12 flex items-center">
                        <div className="absolute inset-x-0 h-1 bg-white/10 rounded-full overflow-hidden">
                             <div className="h-full bg-aral-gold/20" style={{ width: `${(formData.timeCommitment / 180) * 100}%` }} />
                        </div>
                        <input 
                            type="range" 
                            min="10" 
                            max="180" 
                            step="5"
                            value={formData.timeCommitment}
                            onChange={(e) => setFormData({...formData, timeCommitment: parseInt(e.target.value)})}
                            className="absolute inset-x-0 w-full opacity-0 cursor-pointer h-full z-10"
                        />
                        <motion.div 
                            animate={{ left: `${(formData.timeCommitment / 180) * 100}%` }}
                            className="absolute w-8 h-8 bg-aral-gold rounded-full border-4 border-aral-ink -translate-x-1/2 shadow-[0_0_20px_rgba(201,168,76,0.5)] pointer-events-none"
                        />
                    </div>

                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-aral-cream/20">
                        <span>Purity (10m)</span>
                        <span>Synthesis (90m)</span>
                        <span>Transcendence (180m)</span>
                    </div>
                </div>

                <div className="pt-10">
                    <Button 
                        onClick={nextStep}
                        className="bg-aral-gold text-aral-ink hover:bg-aral-gold/90 px-16 h-14 rounded-full font-black uppercase tracking-widest text-[10px]"
                    >
                        Schedule Session
                    </Button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-16">
                 <div className="space-y-4 text-center">
                    <h2 className="text-5xl font-serif italic text-aral-cream tracking-tight">Your Learning Philosophy</h2>
                    <p className="text-aral-gold/40 text-[10px] font-black uppercase tracking-[0.3em]">Cognitive Optimization Path</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { id: 'visual', title: 'Immersive Visual', icon: Sparkles, desc: 'Diagrams, spatial layouts, and rich instructional cinematography.' },
                        { id: 'textual', title: 'Deep Textual', icon: Clock, desc: 'Meticulous prose, technical archives, and precise semantic analysis.' },
                        { id: 'auditory', title: 'Auditory Archival', icon: Trophy, desc: 'Linguistic synthesis, oral traditions, and harmonic learning structures.' },
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => { setFormData({...formData, learningStyle: opt.id}); nextStep(); }}
                            className={cn(
                                "flex flex-col items-center p-10 rounded-[3rem] text-center transition-all group border-2 gap-6",
                                formData.learningStyle === opt.id 
                                    ? "bg-aral-gold border-aral-gold text-aral-ink shadow-2xl shadow-aral-gold/20 scale-105" 
                                    : "bg-white/5 border-white/5 text-aral-cream/60 hover:border-white/10"
                            )}
                        >
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
                                formData.learningStyle === opt.id ? "bg-aral-ink text-aral-gold" : "bg-white/5 text-aral-gold/20 group-hover:text-aral-gold group-hover:bg-white/10"
                            )}>
                                <opt.icon size={28} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-bold tracking-tight leading-none">{opt.title}</h4>
                                <p className={cn(
                                    "text-[10px] leading-relaxed font-medium",
                                    formData.learningStyle === opt.id ? "text-aral-ink/60" : "text-aral-cream/40"
                                )}>{opt.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="text-center space-y-12">
                <div className="flex justify-center">
                    <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="w-24 h-24 bg-aral-gold rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(201,168,76,0.3)]"
                    >
                        <Check size={48} className="text-aral-ink" strokeWidth={4} />
                    </motion.div>
                </div>

                <div className="space-y-6">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl font-serif italic text-aral-cream tracking-tight"
                  >
                    Your path is ready.
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-aral-cream/40 text-sm max-w-md mx-auto leading-relaxed"
                  >
                    We have synthesized your coordinates. The Academy's archives have been shifted to accommodate your unique intellectual signature.
                  </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                >
                    <Button 
                        onClick={() => onComplete(formData)}
                        className="bg-aral-gold text-aral-ink hover:bg-aral-gold/90 px-16 h-16 rounded-full font-black uppercase tracking-widest text-xs group"
                    >
                        Enter Your Dashboard
                        <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
                    </Button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-30">
        <motion.div 
            animate={{ 
                x: [0, 50, -50], 
                y: [0, -30, 30],
                opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-aral-gold/5 rounded-full blur-[150px]"
        />
        <motion.div 
            animate={{ 
                x: [0, -40, 40], 
                y: [0, 60, -60],
                opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute bottom-4 right-1/4 w-[600px] h-[600px] bg-amber-200/5 rounded-full blur-[120px]"
        />
      </div>
    </div>
  );
}
