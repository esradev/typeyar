import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Language, PracticeResult } from '../types';
import { playKeySound } from '../utils/audio';
import { RotateCcw, Volume2, VolumeX, Flame, Target, Clock, Zap } from 'lucide-react';

interface TypingAreaProps {
  content: string;
  language: Language; 
  lessonTitle?: string;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onComplete: (result: PracticeResult) => void;
  onKeyStroke?: (nextChar: string | null, activeKeyCodes: Set<string>) => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  content,
  language,
  lessonTitle,
  soundEnabled,
  onSoundToggle,
  onComplete,
  onKeyStroke,
}) => {
  const [typed, setTyped] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [mistakesByChar, setMistakesByChar] = useState<Record<string, number>>({});
  const [errorCount, setErrorCount] = useState<number>(0);
  const [activeKeyCodes, setActiveKeyCodes] = useState<Set<string>>(new Set());

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  const isRtl = language === 'fa' || language === 'ar';
  const targetChars = content.split('');
  const currentIndex = typed.length;
  const nextChar = currentIndex < targetChars.length ? targetChars[currentIndex] : null;

  // Keep track of active key codes for virtual keyboard
  useEffect(() => {
    onKeyStroke?.(nextChar, activeKeyCodes);
  }, [nextChar, activeKeyCodes, onKeyStroke]);

  // Focus input automatically
  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, [content]);

  // Reset practice
  const resetPractice = useCallback(() => {
    setTyped('');
    setStartTime(null);
    setElapsedSeconds(0);
    setIsActive(false);
    setIsFinished(false);
    setMistakesByChar({});
    setErrorCount(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeout(focusInput, 50);
  }, []);

  // Timer effect
  useEffect(() => {
    if (isActive && !isFinished) {
      timerRef.current = window.setInterval(() => {
        if (startTime) {
          setElapsedSeconds((Date.now() - startTime) / 1000);
        }
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isFinished, startTime]);

  // Calculate live statistics
  const currentMinutes = Math.max(elapsedSeconds / 60, 0.01);
  // Net correct characters
  let correctChars = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === targetChars[i]) {
      correctChars++;
    }
  }
  const rawWpm = Math.round((correctChars / 5) / currentMinutes);
  const liveWpm = Math.max(rawWpm, 0);
  const liveCpm = Math.round(correctChars / currentMinutes);
  const liveAccuracy = typed.length > 0
    ? Math.round((correctChars / typed.length) * 100)
    : 100;

  // Handle key input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Shortcuts: Tab + Enter or Escape to reset
    if (e.key === 'Escape') {
      e.preventDefault();
      resetPractice();
      return;
    }

    // Add physical key to active set
    setActiveKeyCodes((prev) => {
      const next = new Set(prev);
      next.add(e.code);
      return next;
    });

    if (isFinished) return;

    // Backspace handling
    if (e.key === 'Backspace') {
      if (typed.length > 0) {
        setTyped((prev) => prev.slice(0, -1));
        playKeySound(false, false, soundEnabled);
      }
      return;
    }

    // Ignore modifier keys and navigation
    if (
      e.key.length > 1 ||
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      e.key === 'Tab' ||
      e.key === 'Enter'
    ) {
      if (e.key === 'Enter' && targetChars[currentIndex] === '\n') {
        // Allow enter if text has newline
        e.preventDefault();
        processCharacter('\n');
      }
      return;
    }

    e.preventDefault();
    processCharacter(e.key);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setActiveKeyCodes((prev) => {
      const next = new Set(prev);
      next.delete(e.code);
      return next;
    });
  };

  const processCharacter = (inputChar: string) => {
    // Start timer on first character
    if (!isActive) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    const expectedChar = targetChars[currentIndex];
    const isCorrect = inputChar === expectedChar;
    const isSpace = inputChar === ' ';

    // Play click / error audio
    playKeySound(isSpace, !isCorrect, soundEnabled);

    if (!isCorrect) {
      setErrorCount((prev) => prev + 1);
      setMistakesByChar((prev) => ({
        ...prev,
        [expectedChar]: (prev[expectedChar] || 0) + 1,
      }));
    }

    const newTyped = typed + inputChar;
    setTyped(newTyped);

    // Check completion
    if (newTyped.length >= targetChars.length) {
      finishTest(newTyped);
    }
  };

  const finishTest = (finalTyped: string) => {
    setIsFinished(true);
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const endTime = Date.now();
    const durationSec = Math.max((endTime - (startTime || endTime)) / 1000, 1);
    const finalMinutes = durationSec / 60;

    let finalCorrect = 0;
    for (let i = 0; i < finalTyped.length; i++) {
      if (finalTyped[i] === targetChars[i]) {
        finalCorrect++;
      }
    }

    const finalWpm = Math.max(Math.round((finalCorrect / 5) / finalMinutes), 0);
    const finalCpm = Math.round(finalCorrect / finalMinutes);
    const finalAccuracy = Math.max(Math.round((finalCorrect / finalTyped.length) * 100), 0);

    const result: PracticeResult = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      wpm: finalWpm,
      cpm: finalCpm,
      accuracy: finalAccuracy,
      errorCount,
      durationSeconds: Math.round(durationSec),
      language,
      lessonTitle,
      mistakesByChar,
    };

    onComplete(result);
  };

  const progressPercent = Math.min(Math.round((typed.length / targetChars.length) * 100), 100);

  return (
    <div
      ref={containerRef}
      onClick={focusInput}
      className="w-full max-w-4xl mx-auto flex flex-col items-center cursor-text transition-all"
    >
      {/* Hidden input to capture keystrokes reliably on desktop & mobile */}
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute pointer-events-none -z-10"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={() => {
          // Re-focus after short delay if active
          if (isActive && !isFinished) {
            setTimeout(focusInput, 10);
          }
        }}
        autoFocus
        autoComplete="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* Real-time stats bar */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 mb-3 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
        <div className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
          {/* Live WPM */}
          <div className="flex items-center gap-1.5" title="کلمه در دقیقه">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-neutral-500 dark:text-neutral-400 text-xs">سرعت:</span>
            <span className="font-bold text-lg text-neutral-800 dark:text-neutral-100 font-mono">
              {liveWpm}
            </span>
            <span className="text-[11px] text-neutral-400">WPM</span>
          </div>

          {/* Live Accuracy */}
          <div className="flex items-center gap-1.5" title="درصد دقت">
            <Target className="w-4 h-4 text-emerald-500" />
            <span className="text-neutral-500 dark:text-neutral-400 text-xs">دقت:</span>
            <span className="font-bold text-lg text-neutral-800 dark:text-neutral-100 font-mono">
              {liveAccuracy}%
            </span>
          </div>

          {/* Live Timer */}
          <div className="hidden sm:flex items-center gap-1.5" title="زمان سپری‌شده">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-neutral-500 dark:text-neutral-400 text-xs">زمان:</span>
            <span className="font-mono text-neutral-700 dark:text-neutral-300">
              {Math.floor(elapsedSeconds)}s
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSoundToggle();
            }}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={soundEnabled ? 'قطع صدای کلیدها' : 'وصل صدای کلیدها'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetPractice();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60 transition-colors"
            title="شروع مجدد (Esc)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">شروع مجدد</span>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-150"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Typing Text Box - Distraction free */}
      <div
        className={`
          w-full min-h-[160px] sm:min-h-[190px] p-5 sm:p-7
          rounded-2xl border
          bg-white/95 dark:bg-neutral-900/90 backdrop-blur-md
          border-neutral-200/80 dark:border-neutral-800/80
          shadow-sm relative leading-relaxed
          ${isRtl ? 'text-right' : 'text-left'}
          ${language === 'code' ? 'font-code text-base sm:text-lg' : 'text-xl sm:text-2xl'}
        `}
        style={{ direction: isRtl ? 'rtl' : 'ltr' }}
      >
        {/* Render characters */}
        <div className="flex flex-wrap items-baseline content-start tracking-wide select-none">
          {targetChars.map((char, index) => {
            const isTyped = index < typed.length;
            const isCurrent = index === typed.length;
            const userChar = typed[index];
            const isCorrect = isTyped && userChar === char;
            const isError = isTyped && !isCorrect;

            let charStyle = 'text-neutral-400 dark:text-neutral-600 transition-colors duration-75';

            if (isCorrect) {
              charStyle = 'text-emerald-600 dark:text-emerald-400 font-medium';
            } else if (isError) {
              charStyle = 'text-rose-500 bg-rose-500/15 dark:bg-rose-500/25 rounded-xs underline decoration-rose-500 font-medium';
            }

            return (
              <span
                key={index}
                className={`
                  relative inline-block ${charStyle}
                  ${char === ' ' ? 'w-2.5' : ''}
                  ${isCurrent ? 'bg-emerald-500/10 dark:bg-emerald-400/15 rounded-md animate-next-char' : ''}
                `}
              >
                {/* Blinking Caret on current character */}
                {isCurrent && (
                  <span
                    className={`
                      absolute top-0 bottom-0 w-0.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-caret
                      ${isRtl ? '-right-0.5' : '-left-0.5'}
                    `}
                  />
                )}
                {char === '\n' ? <br /> : char}
              </span>
            );
          })}
        </div>

        {/* Subtle helper tooltip at bottom */}
        <div className="mt-6 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 select-none">
          <span>برای تایپ کلیک کنید یا هر کلیدی را فشار دهید</span>
          <span className="hidden sm:inline">کلید <kbd className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700 text-[10px] font-mono">Esc</kbd> شروع دوباره</span>
        </div>
      </div>
    </div>
  );
};
