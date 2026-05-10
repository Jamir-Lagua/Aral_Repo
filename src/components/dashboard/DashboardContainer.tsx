/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Clock, 
  Loader2, 
  ArrowRight, 
  Award, 
  Calendar, 
  GraduationCap, 
  Sparkles,
  Zap,
  Target,
  CircleCheck,
  Circle
} from 'lucide-react';
import { motion, useInView, useSpring, useTransform } from 'motion/react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { useAuth } from '@/src/contexts/AuthContext';
import { handleFirestoreError, OperationType } from '@/src/lib/error-handler';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Helper for count-up animation
function CountUp({ value }: { value: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (current) => Math.floor(current));

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

export function DashboardContainer() {
  const { user } = useAuth();
  const [taskCount, setTaskCount] = useState(0);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [noteCount, setNoteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalFocusTime, setTotalFocusTime] = useState(0);

  useEffect(() => {
    if (!user) return;

    const tasksQuery = query(collection(db, "tasks"), where("userId", "==", user.uid));
    const notesQuery = query(collection(db, "notes"), where("userId", "==", user.uid));
    const sessionsQuery = query(collection(db, "studySessions"), where("userId", "==", user.uid));

    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      setTaskCount(snapshot.size);
      const completed = snapshot.docs.filter(doc => doc.data().completed).length;
      setCompletedTaskCount(completed);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "tasks");
    });

    const unsubscribeNotes = onSnapshot(notesQuery, (snapshot) => {
      setNoteCount(snapshot.size);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "notes");
    });

    const unsubscribeSessions = onSnapshot(sessionsQuery, (snapshot) => {
      const total = snapshot.docs.reduce((acc, doc) => acc + (doc.data().duration || 0), 0);
      setTotalFocusTime(total);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "studySessions");
      setLoading(false);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeNotes();
      unsubscribeSessions();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-10">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-aral-gold" />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-aral-gold rounded-full blur-xl"
          />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-aral-ink/20 animate-pulse">Syncing Archive Nodes</p>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Main Content (Left + Center) */}
      <div className="xl:col-span-8 space-y-20">
        
        {/* Header Greeting */}
        <section className="space-y-4">
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-aral-gold font-sans"
          >
            {today}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-7xl font-serif italic text-aral-ink tracking-tight leading-none"
          >
            Good morning, <br />
            <span className="not-italic font-black text-aral-ink">{user?.displayName?.split(' ')[0] || 'Scholar'}</span>
          </motion.h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="h-[1px] w-48 bg-aral-ink/10 origin-left"
          />
        </section>

        {/* Continue Learning - Horizontal Scroll */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-aral-ink/40">Continue Learning</h3>
            <button className="text-[10px] font-bold uppercase tracking-widest text-aral-gold hover:text-aral-ink transition-colors flex items-center gap-2 group">
              View Journal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="flex overflow-x-auto gap-8 pb-8 scrollbar-hide -mx-4 px-4">
            {IN_PROGRESS_COURSES.map((course, idx) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="min-w-[340px] relative bg-white border border-aral-ink/5 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer group overflow-hidden h-[240px]"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={course.imageUrl} 
                    className="w-full h-full object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000 group-hover:scale-110"
                    alt="" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                </div>

                <div className="relative z-10 p-8 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-auto">
                    <div className="p-3 bg-white/80 backdrop-blur-md rounded-xl text-aral-gold border border-white/20 shadow-sm group-hover:bg-aral-gold group-hover:text-white transition-colors">
                      <course.icon size={18} />
                    </div>
                    <span className="text-[10px] font-black text-aral-ink/20 tracking-widest">{course.id}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-serif font-black text-2xl tracking-tighter leading-[0.9] group-hover:text-aral-gold transition-colors">{course.title}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-aral-ink/40">
                        <span>Mastery</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-[2px] w-full bg-aral-ink/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + idx * 0.1 }}
                          className="h-full bg-aral-gold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Enrolled", value: 4, icon: GraduationCap },
            { label: "Hours Learned", value: Math.floor(totalFocusTime/60), icon: Clock },
            { label: "Daily Streak", value: 12, icon: Zap },
            { label: "Credentials", value: 3, icon: Award },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-aral-blush/30 p-8 rounded-[2rem] text-center space-y-2 group hover:bg-aral-blush/50 transition-all border border-transparent hover:border-aral-ink/5"
            >
              <div className="flex justify-center mb-4">
                <stat.icon className="text-aral-gold opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all" size={24} />
              </div>
              <p className="text-4xl font-black text-aral-ink tracking-tighter"><CountUp value={stat.value} /></p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-aral-ink/30 italic">{stat.label}</p>
            </motion.div>
          ))}
        </section>

        {/* Learning Path & Recommended Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Vertical Timeline */}
          <section className="space-y-10">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-aral-ink/40 flex items-center gap-3">
              <Target size={16} className="text-aral-gold" /> Your Learning Path
            </h3>
            
            <div className="relative pl-12 space-y-12">
              {/* Vertical Drawing Line */}
              <motion.div 
                initial={{ height: 0 }}
                whileInView={{ height: '85%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute left-[19px] top-4 w-[2px] bg-aral-ink/5"
              />

              {TIMELINE_STAGES.map((stage, idx) => (
                <div key={idx} className="relative">
                  <div className={cn(
                    "absolute -left-[53px] top-1 w-10 h-10 rounded-full bg-aral-cream border-2 flex items-center justify-center z-10 transition-colors",
                    stage.completed ? "border-aral-sage text-aral-sage" : "border-aral-ink/10 text-aral-ink/10"
                  )}>
                    {stage.completed ? <CircleCheck size={18} /> : <Circle size={18} />}
                  </div>
                  <div className="space-y-1">
                    <p className={cn(
                      "text-[9px] font-black uppercase tracking-[0.2em]",
                      stage.completed ? "text-aral-sage/60" : "text-aral-ink/20"
                    )}>{stage.date}</p>
                    <h4 className={cn(
                      "text-xl font-bold tracking-tight",
                      stage.completed ? "text-aral-ink" : "text-aral-ink/40"
                    )}>{stage.title}</h4>
                    <p className="text-xs text-aral-ink/40 leading-relaxed max-w-xs">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Cards */}
          <section className="space-y-10">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-aral-ink/40">Recommended for You</h3>
            <div className="space-y-6">
              {RECOMMENDED.map((rec, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 10 }}
                  className="group relative bg-white border border-aral-ink/5 p-6 rounded-[2rem] overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-aral-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-aral-cream flex-shrink-0">
                        <img src={`https://images.unsplash.com/photo-${rec.imgId}?auto=format&fit=crop&q=80&w=200`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                    </div>
                    <div>
                      <h4 className="font-serif italic text-lg leading-tight group-hover:text-aral-gold transition-colors">{rec.title}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-aral-ink/20">{rec.author}</span>
                        <div className="h-[1px] w-4 bg-aral-ink/5" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-aral-gold">{rec.level}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

      </div>

      {/* Sidebar (Right) */}
      <aside className="xl:col-span-4 space-y-16">
        
        {/* Daily Goal Tracker */}
        <section className="bg-white border border-aral-ink/5 p-10 rounded-[3rem] shadow-sm text-center space-y-8">
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-aral-ink/30">Daily Objective</h3>
            <p className="text-3xl font-serif italic text-aral-ink">Deep Focus Session</p>
          </div>

          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                className="text-aral-ink/5" 
              />
              <motion.circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * 0.72) }}
                transition={{ duration: 2, delay: 1 }}
                className="text-aral-gold" 
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-aral-ink">72<span className="text-xl">%</span></span>
              <span className="text-[8px] font-black uppercase tracking-widest text-aral-ink/30">Achieved</span>
            </div>
          </div>

          <p className="text-[10px] font-medium leading-relaxed text-aral-ink/40 max-w-[200px] mx-auto">
            You approach total synthesis. 18 more minutes of focus required to meet your daily intent.
          </p>

          <Button className="w-full bg-aral-ink text-aral-cream hover:bg-aral-gold transition-colors rounded-2xl py-6 font-black uppercase tracking-widest text-[10px]">
            Initiate Session
          </Button>
        </section>

        {/* Upcoming Schedule */}
        <section className="space-y-8">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-aral-ink/40 flex items-center justify-between">
            Schedule <Calendar size={14} />
          </h3>
          <div className="space-y-4">
            {SCHEDULE.map((item, idx) => (
              <div key={idx} className="flex gap-6 items-start group cursor-pointer">
                <div className="flex flex-col items-center min-w-[32px]">
                   <span className="text-xl font-black text-aral-ink/20 group-hover:text-aral-gold transition-colors">{item.time}</span>
                   <span className="text-[8px] font-black uppercase tracking-widest text-aral-ink/40">{item.ampm}</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs tracking-tight text-aral-ink group-hover:text-aral-gold transition-colors">{item.event}</h4>
                  <p className="text-[9px] font-medium text-aral-ink/30 uppercase tracking-[0.1em]">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Achievements */}
        <section className="space-y-8">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-aral-ink/40 flex items-center justify-between">
            Archives Decoded <Award size={14} />
          </h3>
          <div className="flex flex-wrap gap-4">
            {BADGES.map((badge, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center border transition-all hover:scale-110 cursor-help",
                  badge.earned ? "bg-aral-gold/10 border-aral-gold/20 text-aral-gold" : "bg-aral-ink/5 border-aral-ink/5 text-aral-ink/10"
                )}
                title={badge.label}
              >
                <badge.icon size={24} />
              </div>
            ))}
          </div>
        </section>

      </aside>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

const IN_PROGRESS_COURSES = [
  { 
    id: "NODE_01", 
    title: "Aesthetic Foundations", 
    progress: 75, 
    icon: Sparkles,
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600"
  },
  { 
    id: "NODE_04", 
    title: "Theoretical Mechanics", 
    progress: 32, 
    icon: Zap,
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600"
  },
  { 
    id: "NODE_07", 
    title: "Classical Jurisprudence", 
    progress: 58, 
    icon: Target,
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600"
  },
];

const TIMELINE_STAGES = [
  { date: "Completed last May 08", title: "Phenomenology of Form", desc: "Successfully synthesized concepts of subjective aesthetics and the Kantian sublime.", completed: true },
  { date: "Current Focus", title: "Aristotelian Materialism", desc: "Evaluating the tension between substance and accidents in physical aesthetics.", completed: false },
  { date: "Locked Node", title: "Post-Modern Deconstruction", desc: "Unlocking soon: The end of grand narratives in the digital age.", completed: false },
];

const RECOMMENDED = [
  { title: "Neuro-Aesthetics of Color", author: "Dr. Kenji Sato", level: "Expert", imgId: "1456736190891-c7ba55a75a6c" },
  { title: "The Logic of Chaos Theory", author: "Prof. Thorne", level: "Advanced", imgId: "1550684848-86a5d859942d" },
  { title: "Classical Latin Syntax", author: "Marcus II", level: "Beginner", imgId: "1488190211105-8b0e65b80b4e" },
];

const SCHEDULE = [
  { time: "10", ampm: "AM", event: "Classical Synthesis Review", location: "Grand Hall Node" },
  { time: "01", ampm: "PM", event: "Aral-Lab Virtual Session", location: "Remote Workspace" },
  { time: "04", ampm: "PM", event: "Archival Filing", location: "Global Vault" },
];

const BADGES = [
  { icon: GraduationCap, label: "Scholar", earned: true },
  { icon: Sparkles, label: "Creative Force", earned: true },
  { icon: Zap, label: "High Intensity", earned: false },
  { icon: Trophy, label: "Master Polymath", earned: false },
];

