/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Note } from '@/src/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface NoteEditorProps {
  note: Note;
  onUpdate: (updates: Partial<Note>) => void;
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  return (
    <div className="p-10 h-full flex flex-col gap-8 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Input
        value={note.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        className="text-4xl font-black border-none px-0 focus-visible:ring-0 placeholder:text-slate-200 text-slate-900 tracking-tight h-auto"
        placeholder="Milestone Title"
      />
      <div className="flex-1 flex flex-col min-h-[500px] bg-slate-50/50 rounded-3xl p-8 border border-slate-100 ring-1 ring-slate-200/50">
        <Textarea
          value={note.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="flex-1 resize-none border-none text-xl text-slate-700 leading-relaxed px-0 focus-visible:ring-0 placeholder:text-slate-300 bg-transparent"
          placeholder="Unleash your study notes here..."
        />
      </div>
    </div>
  );
}
