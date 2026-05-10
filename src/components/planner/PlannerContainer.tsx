/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, CheckCircle2, Circle, Clock, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskCategory } from '@/src/types';
import { CATEGORY_COLORS } from '@/src/constants';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
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

export function PlannerContainer() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newCategory, setNewCategory] = useState<TaskCategory>(TaskCategory.STUDY);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(taskList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "tasks");
      toast.error("Failed to load tasks");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async () => {
    if (!newTaskTitle.trim() || !user) return;
    
    try {
      await addDoc(collection(db, "tasks"), {
        title: newTaskTitle,
        description: "",
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        category: newCategory,
        completed: false,
        userId: user.uid,
        createdAt: Date.now()
      });
      
      setNewTaskTitle("");
      setIsAdding(false);
      toast.success("Task added successfully!");
    } catch (error) {
      console.error("Add task error:", error);
      toast.error("Failed to add task");
    }
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "tasks", id), {
        completed: !currentStatus
      });
    } catch (error) {
      console.error("Toggle task error:", error);
      toast.error("Cloud update failed");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      toast.info("Task deleted");
    } catch (error) {
      console.error("Delete task error:", error);
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
           <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Study Planner</h2>
          </div>
          <p className="text-slate-500">Stay on top of your academic deadlines.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="gap-2 bg-slate-900 rounded-xl px-6 h-11 active:scale-95 transition-transform">
            <Plus size={18} /> New Milestone
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="p-8 bg-white border border-indigo-100 rounded-3xl shadow-xl shadow-indigo-50 space-y-6 animate-in slide-in-from-top-4 duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
          <Input 
            placeholder="Define your study goal..." 
            value={newTaskTitle} 
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="text-xl font-bold border-none focus-visible:ring-0 p-0 placeholder:text-slate-300 text-slate-800"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <div className="flex items-center gap-4">
             <Select value={newCategory} onValueChange={(val) => setNewCategory(val as TaskCategory)}>
                <SelectTrigger className="w-40 h-10 text-xs font-bold uppercase tracking-widest bg-slate-50 border-none rounded-xl">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  {Object.values(TaskCategory).map(cat => (
                    <SelectItem key={cat} value={cat} className="text-xs font-bold uppercase tracking-wider">{cat}</SelectItem>
                  ))}
                </SelectContent>
             </Select>
             
             <div className="h-10 px-4 bg-slate-50 rounded-xl flex items-center gap-2 text-slate-400">
               <CalendarIcon size={14} />
               <span className="text-[10px] font-bold uppercase tracking-widest">{format(new Date(), 'MMM d, yyyy')}</span>
             </div>
             
             <div className="flex-1" />
             
             <button 
               onClick={() => setIsAdding(false)}
               className="text-xs font-bold text-slate-400 hover:text-slate-600 px-4"
             >
               Discard
             </button>
             <Button onClick={addTask} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 h-10 shadow-lg shadow-indigo-100">
               Commit
             </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
           <div className="flex items-center justify-center py-20">
             <Loader2 className="h-10 w-10 animate-spin text-indigo-200" />
           </div>
        ) : tasks.length === 0 ? (
          <div className="py-32 text-center flex flex-col items-center gap-4 bg-white border border-dashed border-slate-200 rounded-3xl">
            <div className="p-6 bg-slate-50 rounded-full text-slate-300">
              <Clock size={48} strokeWidth={1} />
            </div>
            <div>
              <p className="font-bold text-slate-800">No active milestones</p>
              <p className="text-sm text-slate-400 max-w-xs mx-auto mt-1">Your planner is clear. Add a new task to start tracking your progress.</p>
            </div>
            <Button variant="outline" onClick={() => setIsAdding(true)} className="mt-2 border-slate-200 rounded-xl">Create Task</Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className={`group relative flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all hover:shadow-md hover:border-indigo-100 ${
                  task.completed ? "opacity-60 bg-slate-50/50" : ""
                }`}
              >
                <div className="flex items-start gap-5">
                  <button 
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`mt-1 h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      task.completed 
                        ? "bg-indigo-600 border-indigo-600 text-white" 
                        : "border-slate-200 text-transparent hover:border-indigo-400 group-hover:text-indigo-200"
                    }`}
                  >
                    <CheckCircle2 size={16} />
                  </button>
                  
                  <div className="space-y-2">
                    <p className={`text-lg font-bold tracking-tight text-slate-800 ${task.completed ? "line-through text-slate-400" : ""}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-tighter px-2.5 py-0.5 rounded-full border",
                        task.category === TaskCategory.EXAM ? "bg-red-50 text-red-600 border-red-100" :
                        task.category === TaskCategory.PROJECT ? "bg-amber-50 text-amber-600 border-amber-100" :
                        "bg-indigo-50 text-indigo-600 border-indigo-100"
                      )}>
                        {task.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <CalendarIcon size={12} className="opacity-70" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
