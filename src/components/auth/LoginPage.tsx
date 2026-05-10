/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GraduationCap, LogIn, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/src/contexts/AuthContext';
import { APP_NAME } from '@/src/constants';
import { motion } from 'motion/react';

export function LoginPage({ onBack }: { onBack?: () => void }) {
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-aral-cream relative overflow-hidden px-4">
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 p-3 hover:bg-aral-ink hover:text-aral-cream rounded-full transition-all group z-20"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-aral-gold/5 rounded-full blur-3xl animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-amber-100/10 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-aral-ink/5 border border-aral-ink/5 p-12 text-center">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-aral-ink rounded-[2rem] flex items-center justify-center shadow-2xl shadow-aral-ink/20 mb-8 transform -rotate-6">
              <GraduationCap size={40} className="text-aral-gold" />
            </div>
            <h1 className="text-4xl font-black text-aral-ink tracking-tighter mb-3 leading-none">The Academy</h1>
            <p className="text-aral-ink/40 text-[10px] font-black uppercase tracking-[0.3em]">Sanctum of Knowledge</p>
          </div>

          <div className="space-y-8">
            <div className="text-left space-y-4">
               <p className="text-sm text-aral-ink/60 leading-relaxed font-medium">
                Welcome back, Scholar. Access your curated archives and resume your pursuit of mastery.
               </p>
               <div className="h-[1px] w-full bg-aral-ink/5" />
            </div>

            <Button 
              onClick={signIn}
              className="w-full h-16 bg-aral-ink hover:bg-aral-ink/90 text-aral-cream rounded-2xl font-bold text-sm uppercase tracking-[0.15em] shadow-xl shadow-aral-ink/10 transition-all active:scale-95 flex items-center justify-center gap-4 group"
            >
              <LogIn className="h-5 w-5 text-aral-gold group-hover:scale-110 transition-transform" />
              Authenticate
            </Button>
            
            <div className="flex flex-col items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-aral-ink/20">
                  Secured by ARAL Core
                </p>
                <div className="w-1 h-1 rounded-full bg-aral-gold" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
