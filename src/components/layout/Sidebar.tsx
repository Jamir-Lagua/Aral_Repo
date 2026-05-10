/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LayoutDashboard, BookOpen, Calendar, Settings, LogOut, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/src/constants";
import { useAuth } from "@/src/contexts/AuthContext";
import { motion } from "motion/react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { logout } = useAuth();
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "notebook", label: "Notebook View", icon: BookOpen },
    { id: "planner", label: "Study Planner", icon: Calendar },
    { id: "library", label: "Course Library", icon: GraduationCap },
  ];

  return (
    <div className="flex h-full w-72 flex-col bg-white border-r border-aral-ink/5">
      <div className="p-8 border-b border-aral-ink/5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-aral-ink rounded-xl flex items-center justify-center transform -rotate-6 shadow-xl shadow-aral-ink/20">
            <GraduationCap size={20} className="text-aral-gold" />
          </div>
          <h1 className="font-serif font-black text-2xl tracking-tighter text-aral-ink">{APP_NAME}</h1>
        </div>
        <p className="text-[9px] text-aral-ink/30 uppercase tracking-[0.3em] font-black ml-12">Universal Academy</p>
      </div>

      <nav className="flex-1 space-y-1 px-4 mt-8">
        <h2 className="text-[10px] font-black text-aral-ink/20 uppercase mb-4 px-4 tracking-[0.2em]">Archive Nodes</h2>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "group flex w-full items-center rounded-2xl px-4 py-3.5 text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === item.id
                ? "bg-aral-cream text-aral-ink shadow-sm border border-aral-ink/5"
                : "text-aral-ink/40 hover:bg-aral-cream/50"
            )}
          >
            <item.icon
              className={cn(
                "mr-4 h-5 w-5 transition-colors",
                activeTab === item.id ? "text-aral-gold" : "text-aral-ink/20 group-hover:text-aral-gold"
              )}
            />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 bg-aral-cream/30 border-t border-aral-ink/5">
        <div className="flex justify-between items-end mb-3 px-1">
          <span className="text-[9px] font-black uppercase text-aral-ink/20 tracking-[0.2em]">Academic Mastery</span>
          <span className="text-[10px] font-black text-aral-gold tracking-widest leading-none">68%</span>
        </div>
        <div className="w-full bg-aral-ink/5 h-[3px] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '68%' }}
            className="bg-aral-gold h-full"
          />
        </div>
        
        <button 
          onClick={logout}
          className="mt-8 flex w-full items-center justify-center rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-aral-ink/30 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
        >
          <LogOut className="mr-3 h-4 w-4" />
          End Session
        </button>
      </div>
    </div>
  );
}
