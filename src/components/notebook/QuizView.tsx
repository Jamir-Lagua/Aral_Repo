/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Quiz, QuestionType } from '@/src/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Brain, Lightbulb, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface QuizViewProps {
  quiz: Quiz;
  onComplete?: (score: number) => void;
}

export function QuizView({ quiz, onComplete }: QuizViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isMultipleChoice = currentQuestion.type === QuestionType.MULTIPLE_CHOICE;
  
  const handleAnswerSelect = (index: number) => {
    if (showResult || !isMultipleChoice) return;
    setSelectedAnswer(index);
    setShowResult(true);
    
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = index;
    setAnswers(newAnswers);
  };

  const handleAnalyticalComplete = () => {
    setShowResult(true);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = true; // Just marked as seen/processed
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
      const score = answers.reduce((acc, curr, idx) => {
        const q = quiz.questions[idx];
        if (q.type === QuestionType.MULTIPLE_CHOICE) {
          return curr === q.correctAnswer ? acc + 1 : acc;
        }
        return acc + 1; // Count analytical as "done"
      }, 0);
      if (onComplete) onComplete(score);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers([]);
    setIsFinished(false);
  };

  if (isFinished) {
    const mcQuestions = quiz.questions.filter(q => q.type === QuestionType.MULTIPLE_CHOICE);
    const score = answers.reduce((acc, curr, idx) => {
      const q = quiz.questions[idx];
      if (q.type === QuestionType.MULTIPLE_CHOICE) {
        return curr === q.correctAnswer ? acc + 1 : acc;
      }
      return acc;
    }, 0);
    
    const percentage = mcQuestions.length > 0 
      ? Math.round((score / mcQuestions.length) * 100)
      : 100;

    return (
      <div className="p-10 flex flex-col items-center justify-center text-center space-y-8 h-full animate-in fade-in zoom-in duration-500">
        <div className="h-32 w-32 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border-4 border-white shadow-xl">
           <div className="flex flex-col items-center">
             <span className="text-3xl font-black">{percentage}%</span>
             <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Score</span>
           </div>
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Focus Milestone Reached!</h2>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            {mcQuestions.length > 0 
              ? `You mastered ${score} of ${mcQuestions.length} multiple choice questions and completed all analytical exercises.`
              : `Great job! You've successfully worked through the analytical session.`}
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={resetQuiz} variant="outline" className="gap-2 h-12 px-6 rounded-xl font-bold border-slate-200">
            <RotateCcw size={18} /> Retake 
          </Button>
          <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-xl font-bold shadow-lg shadow-indigo-100">
            Keep Studying
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 h-full flex flex-col max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <Badge variant="outline" className="w-fit text-indigo-600 bg-indigo-50 border-indigo-100 uppercase tracking-widest text-[10px] font-bold">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </Badge>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {isMultipleChoice ? "Multiple Choice" : "Analytical Focus"}
          </span>
        </div>
        <div className="h-1.5 flex-1 mx-8 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-8 flex-1"
        >
          <h3 className="text-2xl font-bold text-slate-800 leading-snug tracking-tight">
            {currentQuestion.text}
          </h3>

          {isMultipleChoice ? (
            <div className="grid gap-3">
              {currentQuestion.options?.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = currentQuestion.correctAnswer === idx;
                
                let variantStyle = "border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/30";
                if (showResult) {
                  if (isCorrect) variantStyle = "border-green-500 bg-green-50 text-green-700 shadow-sm shadow-green-50";
                  else if (isSelected) variantStyle = "border-red-500 bg-red-50 text-red-700";
                  else variantStyle = "border-slate-50 opacity-40";
                }

                return (
                  <button
                    key={idx}
                    disabled={showResult}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center justify-between group ${variantStyle}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-xs font-black transition-all",
                        showResult && isCorrect ? "bg-green-600 border-green-600 text-white" : 
                        showResult && isSelected && !isCorrect ? "bg-red-600 border-red-600 text-white" :
                        isSelected ? "bg-indigo-600 border-indigo-600 text-white scale-110" : "group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white text-slate-400"
                      )}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="font-bold text-slate-700">{option}</span>
                    </div>
                    {showResult && (
                      <div className="flex items-center justify-center w-6 h-6">
                        {isCorrect ? (
                          <CheckCircle2 size={24} className="text-green-500" />
                        ) : isSelected ? (
                          <XCircle size={24} className="text-red-500" />
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {!showResult ? (
                <div className="bg-slate-50 rounded-3xl p-12 border border-slate-100 border-dashed flex flex-col items-center justify-center gap-6 text-center">
                  <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Brain className="text-indigo-400 h-10 w-10 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Critical Thinking Exercise</h4>
                    <p className="text-sm text-slate-400 mt-1">Reflect on the question above. When you have a mental model, reveal the synthesized insight.</p>
                  </div>
                  <Button 
                    onClick={handleAnalyticalComplete}
                    className="bg-slate-900 h-12 px-10 rounded-xl font-bold shadow-lg active:scale-95 transition-all"
                  >
                    Reveal Insight
                  </Button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Lightbulb size={120} />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2">
                       <Badge className="bg-white/20 text-white border-none text-[10px] uppercase font-bold tracking-widest h-5">Model Analysis</Badge>
                    </div>
                    <div className="text-lg leading-relaxed font-medium text-indigo-50">
                       {currentQuestion.correctAnswer}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {showResult && currentQuestion.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 rounded-3xl bg-slate-50 border border-slate-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-indigo-600" />
                <p className="font-black text-indigo-900 uppercase tracking-widest text-[10px]">Tutor Synthesis</p>
              </div>
              <p className="text-slate-600 leading-relaxed italic text-sm">{currentQuestion.explanation}</p>
            </motion.div>
          )}

          <div className="pt-10 flex justify-end">
            <Button
              disabled={!showResult}
              onClick={nextQuestion}
              className="px-10 h-14 rounded-2xl bg-slate-900 text-white font-black text-sm tracking-tight hover:bg-slate-800 transition-all shadow-xl active:scale-95"
            >
              {currentQuestionIndex === quiz.questions.length - 1 ? "Finish Session" : "Advance Milestone"}
              <ChevronRight size={20} className="ml-2" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
