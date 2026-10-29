import React, { useEffect } from 'react';
import { PracticeResult } from '../types';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowRight, Zap, Target, AlertTriangle, Clock, Award } from 'lucide-react';

interface ResultModalProps {
  result: PracticeResult;
  onRetry: () => void;
  onNextLesson?: () => void;
  onPracticeWeakKeys?: (keys: string[]) => void;
  hasNextLesson?: boolean;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  onRetry,
  onNextLesson,
  onPracticeWeakKeys,
  hasNextLesson = false,
}) => {
  // Fire confetti if score is great!
  useEffect(() => {
    if (result.accuracy >= 90 && result.wpm >= 20) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'],
        });
      } catch {
        // Ignore
      }
    }
  }, [result]);

  const mistakesEntries = (Object.entries(result.mistakesByChar || {}) as [string, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  const weakChars = mistakesEntries.map(([char]) => char).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Top subtle decorative gradient */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/15 dark:bg-emerald-500/25 blur-3xl pointer-events-none rounded-full" />

        {/* Icon & Title */}
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <Award className="w-8 h-8" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          تمرین با موفقیت تکمیل شد!
        </h3>
        {result.lessonTitle && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {result.lessonTitle}
          </p>
        )}

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">سرعت</span>
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
              {result.wpm}
            </div>
            <span className="text-[11px] text-neutral-400">WPM</span>
          </div>

          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="flex items-center justify-center gap-1 text-emerald-500 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">دقت</span>
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
              {result.accuracy}%
            </div>
            <span className="text-[11px] text-neutral-400">کاراکترهای صحیح</span>
          </div>

          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="flex items-center justify-center gap-1 text-rose-500 mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">خطاها</span>
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
              {result.errorCount}
            </div>
            <span className="text-[11px] text-neutral-400">تعداد اشتباه</span>
          </div>

          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60">
            <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">زمان</span>
            </div>
            <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
              {result.durationSeconds}
            </div>
            <span className="text-[11px] text-neutral-400">ثانیه</span>
          </div>
        </div>

        {/* Weak Keys Section (if any mistakes) */}
        {weakChars.length > 0 && (
          <div className="mb-6 p-3.5 bg-rose-500/5 dark:bg-rose-500/10 rounded-2xl border border-rose-500/20 text-right">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                کلیدهای نیازمند تمرین بیشتر (کلیدهای ضعیف):
              </span>
              {onPracticeWeakKeys && (
                <button
                  type="button"
                  onClick={() => onPracticeWeakKeys(weakChars)}
                  className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  تمرین هوشمند این کلیدها →
                </button>
              )}
            </div>
            <div className="flex gap-2 flex-wrap justify-start">
              {mistakesEntries.slice(0, 5).map(([char, count]) => (
                <span
                  key={char}
                  className="px-2.5 py-1 bg-white dark:bg-neutral-800 rounded-lg border border-rose-200 dark:border-rose-900/60 text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 shadow-2xs"
                >
                  {char === ' ' ? 'فاصله' : char}
                  <span className="mr-1.5 text-[10px] text-rose-500 font-normal">({count} خطا)</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>تکرار همین درس</span>
          </button>

          {hasNextLesson && onNextLesson && (
            <button
              type="button"
              onClick={onNextLesson}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <span>درس بعدی</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
