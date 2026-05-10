/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "../GlobalSearch";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-100 bg-white px-10">
      <div className="flex items-center gap-10 h-full">
        <div className="flex flex-col gap-0.5">
           <h1 className="text-xl font-black text-slate-900 tracking-tight capitalize">
            {title.replace("-", " ")}
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">NLP Sync Active</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <GlobalSearch />

        <div className="h-10 w-[1px] bg-slate-100 mx-2" />

        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 h-10 w-10 rounded-xl hover:bg-indigo-50/50 transition-all">
          <Bell className="h-5 w-5" />
        </Button>

        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium cursor-pointer hover:ring-2 hover:ring-indigo-100 transition-all">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}
