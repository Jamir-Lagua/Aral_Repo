/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Library, 
  Target, 
  ChevronRight, 
  ArrowRight,
  Diamond,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function LandingPage({ onLogin }: { onLogin?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-aral-cream text-aral-ink selection:bg-aral-gold/30">
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 py-6 px-8 md:px-20 flex items-center justify-between",
        isScrolled ? "bg-aral-cream/80 backdrop-blur-xl py-4 border-b border-aral-ink/5" : ""
      )}>
        <div className="flex items-center gap-12">
          <a href="#" className="text-2xl font-serif font-black tracking-tighter hover:text-aral-gold transition-colors">
            Aral
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            {['Courses', 'Library', 'Progress', 'About'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-xs font-bold uppercase tracking-widest text-aral-ink/60 hover:text-aral-ink transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={onLogin}
            className="hidden md:flex text-xs font-bold uppercase tracking-widest hover:bg-aral-ink hover:text-aral-cream px-8 rounded-full h-10 border border-transparent hover:border-aral-ink transition-all"
          >
            Sign In
          </Button>
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden px-8">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <motion.div 
            animate={{ 
              x: [0, 100, -50], 
              y: [0, -80, 40],
              scale: [1, 1.2, 0.9]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-aral-gold/10 blur-[120px]"
          />
          <motion.div 
            animate={{ 
              x: [0, -120, 80], 
              y: [0, 100, -60],
              scale: [1, 0.8, 1.1]
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-amber-200/20 blur-[120px]"
          />
        </div>

        <div className="max-w-5xl w-full text-center space-y-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <h1 className="text-6xl md:text-9xl font-black tracking-tight leading-[0.85] text-aral-ink">
              Learn Anything.<br />
              <span className="italic font-normal">Master Everything.</span>
            </h1>

            <div className="flex flex-col items-center gap-6">
               <div className="h-[1px] w-48 bg-aral-ink/10 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-aral-cream px-3">
                    <Diamond size={10} className="text-aral-gold fill-aral-gold" />
                  </div>
               </div>
               <p className="text-sm md:text-xl font-medium max-w-2xl mx-auto text-aral-ink/70 leading-relaxed">
                Elevate your intellect with A.R.A.L. — A curated sanctuary for deep learners, digital scholars, and modern masters of polymathy.
               </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <button 
              onClick={onLogin}
              className="group relative bg-aral-ink text-aral-cream px-12 py-5 rounded-full font-bold text-sm uppercase tracking-[0.2em] overflow-hidden transition-all hover:pr-14 active:scale-95 shadow-2xl shadow-aral-ink/20"
            >
              <div className="shimmer-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Start Learning</span>
              <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={18} />
            </button>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-aral-gold">Curated for Excellence</p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group p-10 bg-white border border-aral-ink/5 rounded-[3rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="w-16 h-16 bg-aral-cream rounded-2xl flex items-center justify-center mb-8 group-hover:bg-aral-gold/10 transition-colors">
                <feature.icon className="text-aral-gold" size={32} />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tighter leading-none">{feature.title}</h3>
              <p className="text-aral-ink/60 text-sm leading-relaxed font-medium">
                {feature.description}
              </p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-aral-ink/30 border-t border-aral-ink/5 pt-6 group-hover:text-aral-gold group-hover:border-aral-gold/20 transition-all">
                Learn More <ChevronRight size={12} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-aral-ink/5 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="text-2xl font-serif font-black tracking-tighter">Aral</span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-aral-ink/40">© 2026 ARAL ACADEMIA — MANUFACTURED FOR MASTERS</p>
        </div>
        <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-aral-ink/60">
            <a href="#" className="hover:text-aral-gold transition-colors">Privacy Philosophy</a>
            <a href="#" className="hover:text-aral-gold transition-colors">Manifesto</a>
            <a href="#" className="hover:text-aral-gold transition-colors">Journal</a>
        </div>
      </footer>
    </div>
  );
}

const FEATURES = [
  {
    title: "Semantic Synthesis",
    description: "Our AI doesn't just summarize; it distills your study materials into their purest philosophical essence and actionable insights.",
    icon: Sparkles
  },
  {
    title: "Digital Archive",
    description: "A meticulously organized vault for your intellectual property. Notes, resources, and reflections kept in high-fidelity order.",
    icon: Library
  },
  {
    title: "Precision Path",
    description: "Architect your learning journey with target-driven milestones and automated progress optimization algorithms.",
    icon: Target
  }
];
