/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap, Timer, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/src/lib/firebase';
import { cn } from '@/lib/utils';

export function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = async () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(() => {});

    if (mode === 'work') {
      toast.success('Work session completed! Time for a break.');
      setSessionsCompleted((prev) => prev + 1);
      
      // Save session to Firestore
      try {
        if (auth.currentUser) {
          await addDoc(collection(db, 'studySessions'), {
            userId: auth.currentUser.uid,
            duration: 25,
            timestamp: serverTimestamp(),
            type: 'focus'
          });
        }
      } catch (error) {
        console.error('Error saving study session:', error);
      }

      setMode('break');
      setTimeLeft(5 * 60);
    } else {
      toast.info('Break over. Ready for another session?');
      setMode('work');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' ? (timeLeft / (25 * 60)) : (timeLeft / (5 * 60));

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-10 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
         <motion.div 
            className={cn("h-full", mode === 'work' ? "bg-indigo-600" : "bg-emerald-500")}
            initial={{ width: '100%' }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ ease: "linear" }}
         />
      </div>

      <div className="flex flex-col items-center text-center mb-10">
        <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-colors",
            mode === 'work' ? "bg-indigo-50 text-indigo-600 shadow-indigo-100" : "bg-emerald-50 text-emerald-600 shadow-emerald-100"
        )}>
          {mode === 'work' ? <Brain size={28} /> : <Coffee size={28} />}
        </div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            {mode === 'work' ? 'Deep Work Session' : 'Momentary Respite'}
        </h3>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Focus Protocol Activated
        </p>
      </div>

      <div className="relative mb-12">
        <div className="text-8xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm">
          {formatTime(timeLeft)}
        </div>
        <div className="absolute -bottom-4 right-0 flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
            <Zap size={10} className="text-amber-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sessionsCompleted} Cycles</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button 
            onClick={toggleTimer}
            className={cn(
                "h-14 px-10 rounded-2xl font-black text-sm tracking-tight shadow-xl transition-all flex items-center gap-3 active:scale-95",
                isActive 
                    ? "bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-200" 
                    : (mode === 'work' ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100" : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100")
            )}
        >
          {isActive ? <Pause size={18} /> : <Play size={18} />}
          {isActive ? 'Suspend' : 'Initiate'}
        </Button>
        
        <Button 
            variant="outline" 
            size="icon" 
            onClick={resetTimer}
            className="h-14 w-14 rounded-2xl border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all"
        >
          <RotateCcw size={20} />
        </Button>
      </div>

      <div className="mt-12 flex items-center gap-2 text-slate-300">
        <Timer size={14} />
        <span className="text-[10px] font-bold uppercase tracking-widest">A.R.A.L. Chronos Engine</span>
      </div>
    </div>
  );
}
