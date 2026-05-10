/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Plus, Search, FileText, Sparkles, BrainCircuit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Note, Quiz, Flashcard, ResourceSuggestion } from '@/src/types';
import { NoteEditor } from './NoteEditor';
import { AISummary } from './AISummary';
import { QuizView } from './QuizView';
import { FlashcardView } from './FlashcardView';
import { 
  summarizeText, 
  generateQuizFromText, 
  generateFlashcardsFromText, 
  suggestResourcesForTopic 
} from '@/src/lib/gemini';
import { toast } from 'sonner';
import { SquareStack, Globe } from 'lucide-react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { useAuth } from '@/src/contexts/AuthContext';
import { handleFirestoreError, OperationType } from '@/src/lib/error-handler';

export function NotebookContainer() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const [isSuggestingResources, setIsSuggestingResources] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeFlashcards, setActiveFlashcards] = useState<Flashcard[]>([]);
  const [suggestedResources, setSuggestedResources] = useState<ResourceSuggestion[]>([]);
  const [viewMode, setViewMode] = useState<'edit' | 'summary' | 'quiz' | 'flashcards'>('edit');
  const [filter, setFilter] = useState("");

  const activeNote = notes.find(n => n.id === activeNoteId);
  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(filter.toLowerCase()));

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notes"),
      where("userId", "==", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      setNotes(notesList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "notes");
      toast.error("Failed to load notes");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createNote = async () => {
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, "notes"), {
        title: "Untitled Note",
        content: "",
        summary: "",
        userId: user.uid,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      setActiveNoteId(docRef.id);
      setViewMode('edit');
      setActiveQuiz(null);
      toast.success("New note created");
    } catch (error) {
       console.error("Create note error:", error);
       toast.error("Failed to create note");
    }
  };

  const updateNoteInDb = async (id: string, updates: Partial<Note>) => {
    try {
      await updateDoc(doc(db, "notes", id), {
        ...updates,
        updatedAt: Date.now()
      });
    } catch (error) {
       console.error("Update note error:", error);
       toast.error("Auto-save failed");
    }
  };

  const handleSummarize = async () => {
    if (!activeNote || !activeNote.content) {
      toast.error("Please add some content to summarize.");
      return;
    }
    
    setIsSummarizing(true);
    setViewMode('summary');
    
    try {
      const summary = await summarizeText(activeNote.content);
      const resources = await suggestResourcesForTopic(activeNote.content);
      await updateNoteInDb(activeNote.id, { summary });
      setSuggestedResources(resources);
      toast.success("Synthesis complete!");
    } catch (error) {
      toast.error("Summarization failed");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!activeNote || !activeNote.content) {
      toast.error("Please add some content to generate a quiz.");
      return;
    }

    setIsGeneratingQuiz(true);
    try {
      const quizData = await generateQuizFromText(activeNote.content, activeNote.title);
      
      if (quizData) {
        const newQuiz: Quiz = {
          id: Math.random().toString(36).substr(2, 9),
          noteId: activeNote.id,
          title: quizData.title || `Quiz for ${activeNote.title}`,
          questions: quizData.questions || [],
          userId: user?.uid || "",
          createdAt: Date.now(),
        };
        setActiveQuiz(newQuiz);
        setViewMode('quiz');
        toast.success("Quiz generated!");
      } else {
        toast.error("Failed to generate quiz. Please try again.");
      }
    } catch (error) {
      toast.error("Quiz generation failed");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!activeNote || !activeNote.content) {
      toast.error("Please add content for flashcards.");
      return;
    }

    setIsGeneratingFlashcards(true);
    try {
      const flashcardsData = await generateFlashcardsFromText(activeNote.content);
      if (flashcardsData && flashcardsData.length > 0) {
        const formattedFlashcards: Flashcard[] = flashcardsData.map((f: any, i: number) => ({
          id: `fc-${i}-${Date.now()}`,
          front: f.front,
          back: f.back,
          noteId: activeNote.id
        }));
        setActiveFlashcards(formattedFlashcards);
        setViewMode('flashcards');
        toast.success("Revision pack ready!");
      } else {
        toast.error("Cloud failed to synthesize cards.");
      }
    } catch (error) {
      toast.error("Flashcard synthesis failed.");
    } finally {
      setIsGeneratingFlashcards(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, "notes", id));
      if (activeNoteId === id) setActiveNoteId(null);
      toast.info("Note deleted");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="flex h-full gap-8 p-10 overflow-hidden animate-in fade-in duration-500">
      {/* Sidebar - Note List */}
      <div className="w-80 flex flex-col gap-6 border border-slate-100 rounded-3xl bg-white p-6 shadow-sm h-full">
        <Button onClick={createNote} className="w-full h-12 gap-2 bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95">
          <Plus size={20} /> <span className="font-bold tracking-tight">New Note</span>
        </Button>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <Input 
            placeholder="Search notes..." 
            className="pl-9 h-11 text-sm bg-slate-50 border-none rounded-2xl focus-visible:ring-indigo-500" 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        
        <ScrollArea className="flex-1 -mx-2 px-2">
          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 mb-4">Study Archive</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 size={24} className="animate-spin text-indigo-200" />
              </div>
            ) : filteredNotes.map(note => (
              <div key={note.id} className="group relative">
                <button
                  onClick={() => {
                    setActiveNoteId(note.id);
                    setViewMode('edit');
                    setActiveQuiz(null);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm transition-all flex items-center gap-4 pr-10 border ${
                    activeNoteId === note.id 
                      ? "bg-indigo-50 border-indigo-100 text-indigo-900 font-bold shadow-sm shadow-indigo-50" 
                      : "text-slate-500 hover:bg-slate-50 border-transparent"
                  }`}
                >
                  <div className={cn(
                    "p-2 rounded-xl transition-colors",
                    activeNoteId === note.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                  )}>
                    <FileText size={16} />
                  </div>
                  <span className="truncate">{note.title}</span>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                   <Plus className="rotate-45" size={18} />
                </button>
              </div>
            ))}
            {!loading && filteredNotes.length === 0 && (
              <div className="text-center py-10 opacity-50">
                <BrainCircuit size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                  {filter ? "No search results" : "Vault is empty"}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col border border-slate-100 rounded-3xl bg-white shadow-sm overflow-hidden h-full relative">
        {activeNote ? (
          <>
            <div className="flex items-center justify-between p-4 border-b border-slate-50 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <button 
                  onClick={() => setViewMode('edit')}
                  className={cn(
                    "px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest",
                    viewMode === 'edit' ? "bg-white text-indigo-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  Editor
                </button>
                <button 
                  onClick={() => setViewMode('summary')}
                  className={cn(
                    "px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest",
                    viewMode === 'summary' ? "bg-white text-indigo-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  Summary
                </button>
                <button 
                  onClick={() => setViewMode('flashcards')}
                  className={cn(
                    "px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest",
                    viewMode === 'flashcards' ? "bg-white text-indigo-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  Flashcards
                </button>
                {activeQuiz && (
                  <button 
                    onClick={() => setViewMode('quiz')}
                    className={cn(
                      "px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest",
                      viewMode === 'quiz' ? "bg-white text-indigo-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    Quiz Center
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 rounded-xl gap-2 font-bold text-xs tracking-tight border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all"
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                >
                  <Sparkles size={16} className={isSummarizing ? "animate-spin" : "text-indigo-400"} /> 
                  {isSummarizing ? "Synthesizing..." : "Summarize"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 rounded-xl gap-2 font-bold text-xs tracking-tight border-slate-200 text-slate-700 hover:text-purple-600 hover:border-purple-100 hover:bg-purple-50/50 transition-all"
                  onClick={handleGenerateQuiz}
                  disabled={isGeneratingQuiz}
                >
                  <BrainCircuit size={16} className={isGeneratingQuiz ? "animate-spin" : "text-purple-400"} /> 
                  {isGeneratingQuiz ? "Thinking..." : "Generate Quiz"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 rounded-xl gap-2 font-bold text-xs tracking-tight border-slate-200 text-slate-700 hover:text-amber-600 hover:border-amber-100 hover:bg-amber-50/50 transition-all"
                  onClick={handleGenerateFlashcards}
                  disabled={isGeneratingFlashcards}
                >
                  <SquareStack size={16} className={isGeneratingFlashcards ? "animate-spin" : "text-amber-400"} /> 
                  {isGeneratingFlashcards ? "Packing..." : "Flashcards"}
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-white">
              {viewMode === 'edit' && (
                <NoteEditor 
                  note={activeNote} 
                  onUpdate={(updates) => updateNoteInDb(activeNote.id, updates)} 
                />
              )}
              {viewMode === 'summary' && (
                <AISummary summary={activeNote.summary} isLoading={isSummarizing} resources={suggestedResources} />
              )}
              {viewMode === 'flashcards' && (
                <FlashcardView flashcards={activeFlashcards} />
              )}
              {viewMode === 'quiz' && activeQuiz && (
                <QuizView quiz={activeQuiz} onComplete={() => toast.success("Quiz completed!")} />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-6">
            <div className="h-32 w-32 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
               <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-inner">
                 <FileText size={40} className="opacity-20" />
               </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800 tracking-tight">Focus on something</p>
              <p className="text-sm text-slate-400 mt-1">Select a material from your archive to begin learning.</p>
            </div>
            <Button onClick={createNote} className="bg-slate-900 rounded-xl px-10 h-12 shadow-lg shadow-slate-100">Create New Note</Button>
          </div>
        )}
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
