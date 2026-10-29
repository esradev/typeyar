import React, { useState, useEffect, useRef } from 'react';
import { Language, PracticeResult, RaceRacer } from '../types';
import { playKeySound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Flag, Trophy, Users, Zap, RotateCcw, Medal, Play, Sparkles } from 'lucide-react';

interface OnlineRaceProps {
  userDisplayName: string;
  soundEnabled: boolean;
  onRaceFinish: (result: PracticeResult) => void;
}

const RACE_TEXTS: Record<Language, string[]> = {
  fa: [
    'سرعت و دقت دو بال پرواز در دنیای تایپ هستند. هر کلمه‌ای که بدون نگاه کردن به کلیدها می‌نویسید، شما را یک گام به استادی نزدیک‌تر می‌کند.',
    'تلاش مداوم و تمرین روزانه ذهن را بیدار نگه می‌دارد. برندگان مسابقه کسانی هستند که حتی پس از یک اشتباه، با آرامش به مسیر ادامه می‌دهند.',
    'مهارت تایپ سریع مانند نواختن پیانو است؛ هر انگشت باید نغمه خود را بدون مکث و با ظرافت کامل بنوازد.'
  ],
  en: [
    'The true secret of high speed typing lies in steady rhythm, calm breathing, and absolute confidence in your finger positions.',
    'Focus on accuracy first and velocity will follow naturally. Never sacrifice precision for frantic key tapping.',
    'Software engineering thrives on fluent typing. Translating thoughts into clean syntax without hesitation is pure power.'
  ],
  ar: [
    'المنافسة الشريفة تشحذ الهمم وتصقل المهارات. بالصبر والمداومة تبلغ أرفع مراتب الإتقان في سرعة الكتابة والبيان.',
    'العلم يبني بيوتا لا عماد لها والجهل يهدم بيوت العز والشرف. سرعة البديهة وحسن الترتيب يثمران النجاح الدائم.'
  ],
  code: [
    'const calculateScore = (wpm, accuracy) => (wpm * 1.5 + accuracy * 0.5).toFixed(2); export default calculateScore;',
    'async function syncPlayerData(playerId) { const res = await fetch(`/api/race/${playerId}`); return res.json(); }'
  ]
};

const BOT_POOL = [
  { name: 'علی_کدنویس', avatar: '🏎️', baseWpm: 48 },
  { name: 'سارا_تایپ', avatar: '🚀', baseWpm: 56 },
  { name: 'نیما_اسپید', avatar: '⚡', baseWpm: 42 },
  { name: 'مریم_پرو', avatar: '🎯', baseWpm: 64 },
  { name: 'Alex_QWERTY', avatar: '🛸', baseWpm: 52 },
  { name: 'CodeNinja', avatar: '🐱‍💻', baseWpm: 68 },
];

export const OnlineRace: React.FC<OnlineRaceProps> = ({
  userDisplayName,
  soundEnabled,
  onRaceFinish,
}) => {
  const [raceLang, setRaceLang] = useState<Language>('fa');
  const [gameState, setGameState] = useState<'lobby' | 'countdown' | 'racing' | 'finished'>('lobby');
  const [countdown, setCountdown] = useState<number>(3);
  const [raceText, setRaceText] = useState<string>('');
  const [typed, setTyped] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [racers, setRacers] = useState<RaceRacer[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const raceIntervalRef = useRef<number | null>(null);

  // Initialize or start matchmaking
  const startMatchmaking = () => {
    // Pick random text for language
    const texts = RACE_TEXTS[raceLang];
    const chosenText = texts[Math.floor(Math.random() * texts.length)];
    setRaceText(chosenText);
    setTyped('');

    // Pick 3 random bots
    const shuffledBots = [...BOT_POOL].sort(() => 0.5 - Math.random()).slice(0, 3);
    const initialRacers: RaceRacer[] = [
      {
        id: 'user',
        name: userDisplayName || 'شما',
        avatar: '🏎️',
        isUser: true,
        targetWpm: 0,
        currentWpm: 0,
        progress: 0,
        finished: false,
      },
      ...shuffledBots.map((bot, i) => ({
        id: `bot-${i}`,
        name: bot.name,
        avatar: bot.avatar,
        isUser: false,
        targetWpm: bot.baseWpm + Math.floor(Math.random() * 10 - 5),
        currentWpm: bot.baseWpm,
        progress: 0,
        finished: false,
      })),
    ];

    setRacers(initialRacers);
    setGameState('countdown');
    setCountdown(3);
  };

  // Countdown timer
  useEffect(() => {
    if (gameState === 'countdown') {
      if (countdown > 0) {
        const t = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(t);
      } else {
        setGameState('racing');
        setStartTime(Date.now());
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }
  }, [gameState, countdown]);

  // Race loop simulation for bots and live ranks
  useEffect(() => {
    if (gameState === 'racing') {
      raceIntervalRef.current = window.setInterval(() => {
        if (!startTime) return;
        const now = Date.now();
        const elapsedSec = (now - startTime) / 1000;

        setRacers((prev) => {
          return prev.map((racer) => {
            if (racer.isUser || racer.finished) return racer;

            // Bot speed calculation (chars per second)
            // 1 WPM ≈ 5 CPM => charsPerSec = (WPM * 5) / 60
            const charsPerSec = (racer.targetWpm * 5) / 60;
            // Add slight natural jitter
            const jitter = (Math.random() - 0.5) * 0.3;
            const simulatedChars = Math.min((charsPerSec + jitter) * elapsedSec, raceText.length);
            const progress = Math.min(Math.round((simulatedChars / raceText.length) * 100), 100);
            const finished = progress >= 100;

            return {
              ...racer,
              progress,
              finished,
              finishTime: finished && !racer.finishTime ? elapsedSec : racer.finishTime,
              currentWpm: Math.round(racer.targetWpm + (Math.random() * 4 - 2)),
            };
          });
        });
      }, 200);
    } else {
      if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
    }
    return () => {
      if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);
    };
  }, [gameState, startTime, raceText]);

  // User input handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameState !== 'racing') return;

    if (e.key === 'Backspace') {
      if (typed.length > 0) {
        setTyped((prev) => prev.slice(0, -1));
        playKeySound(false, false, soundEnabled);
      }
      return;
    }

    if (e.key.length > 1 || e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }

    e.preventDefault();
    const inputChar = e.key;
    const targetChar = raceText[typed.length];
    const isCorrect = inputChar === targetChar;

    playKeySound(inputChar === ' ', !isCorrect, soundEnabled);

    // In race mode, only advance on correct character to simulate authentic typing race
    if (isCorrect) {
      const nextTyped = typed + inputChar;
      setTyped(nextTyped);

      const elapsedSec = Math.max((Date.now() - (startTime || Date.now())) / 1000, 0.5);
      const userWpm = Math.round((nextTyped.length / 5) / (elapsedSec / 60));
      const userProgress = Math.min(Math.round((nextTyped.length / raceText.length) * 100), 100);
      const userFinished = nextTyped.length >= raceText.length;

      setRacers((prev) =>
        prev.map((r) =>
          r.isUser
            ? {
                ...r,
                progress: userProgress,
                currentWpm: userWpm,
                finished: userFinished,
                finishTime: userFinished ? elapsedSec : undefined,
              }
            : r
        )
      );

      if (userFinished) {
        finishRace(userWpm, elapsedSec);
      }
    }
  };

  const finishRace = (userWpm: number, elapsedSec: number) => {
    setGameState('finished');
    if (raceIntervalRef.current) clearInterval(raceIntervalRef.current);

    // Calculate final ranks
    setRacers((prev) => {
      const sorted = [...prev].sort((a, b) => (b.progress - a.progress) || ((a.finishTime || 999) - (b.finishTime || 999)));
      return sorted.map((r, i) => ({ ...r, rank: i + 1 }));
    });

    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch {
      // Ignore
    }

    const result: PracticeResult = {
      id: `race-${Date.now()}`,
      timestamp: Date.now(),
      wpm: userWpm,
      cpm: Math.round(userWpm * 5),
      accuracy: 98,
      errorCount: 1,
      durationSeconds: Math.round(elapsedSec),
      language: raceLang,
      lessonTitle: 'مسابقه آنلاین رده‌بندی',
      mistakesByChar: {},
    };

    onRaceFinish(result);
  };

  const isRtl = raceLang === 'fa' || raceLang === 'ar';

  return (
    <div className="w-full max-w-4xl mx-auto py-3">
      {/* Race Arena Container */}
      <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-md p-6 sm:p-8 relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-6 border-b border-neutral-200/70 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-2xl shadow-md">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                پیست مسابقه تایپ آنلاین
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  زنده (Live)
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                با رقبای دیگر به صورت همزمان مسابقه دهید و رکورد سرعت خود را بشکنید!
              </p>
            </div>
          </div>

          {/* Language selection */}
          {gameState === 'lobby' && (
            <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setRaceLang('fa')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  raceLang === 'fa'
                    ? 'bg-white dark:bg-neutral-700 font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                فارسی
              </button>
              <button
                type="button"
                onClick={() => setRaceLang('en')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  raceLang === 'en'
                    ? 'bg-white dark:bg-neutral-700 font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setRaceLang('code')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  raceLang === 'code'
                    ? 'bg-white dark:bg-neutral-700 font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                کدنویسی
              </button>
            </div>
          )}
        </div>

        {/* Lobby State */}
        {gameState === 'lobby' && (
          <div className="text-center py-10 space-y-6">
            <div className="max-w-md mx-auto p-5 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60 text-right space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
              <div className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">قوانین مسابقه:</div>
              <p>• سیستم بلافاصله ۳ همبازی آنلاین در سطح شما پیدا می‌کند.</p>
              <p>• هر چقدر سریع‌تر و با خطای کمتر تایپ کنید، ماشین شما با شتاب بیشتری جلو می‌رود.</p>
              <p>• جایگاه‌های اول تا سوم صاحب کاپ قهرمانی و نشان سرعت می‌شوند.</p>
            </div>

            <button
              type="button"
              onClick={startMatchmaking}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>پیدا کردن حریف و شروع مسابقه</span>
            </button>
          </div>
        )}

        {/* Countdown state */}
        {gameState === 'countdown' && (
          <div className="text-center py-12">
            <span className="text-xs text-neutral-400 mb-2 block">آماده باشید...</span>
            <div className="text-7xl font-extrabold font-mono text-emerald-500 animate-bounce">
              {countdown > 0 ? countdown : 'حرکت! 🏁'}
            </div>
          </div>
        )}

        {/* Racing or Finished state */}
        {(gameState === 'racing' || gameState === 'finished') && (
          <div className="space-y-6">
            {/* Live Race Tracks */}
            <div className="space-y-3 bg-neutral-100/90 dark:bg-neutral-850 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
              {racers.map((racer) => (
                <div key={racer.id} className="relative">
                  <div className="flex items-center justify-between text-xs mb-1 px-1">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                      <span>{racer.avatar}</span>
                      <span>{racer.name}</span>
                      {racer.isUser && (
                        <span className="px-1.5 py-0.2 rounded-sm text-[10px] bg-emerald-500 text-white font-bold">
                          شما
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-neutral-500 dark:text-neutral-400">
                      {racer.currentWpm} WPM • {racer.progress}%
                    </span>
                  </div>

                  {/* Track line */}
                  <div className="h-6 w-full bg-neutral-200/80 dark:bg-neutral-800 rounded-lg relative overflow-hidden flex items-center px-1">
                    {/* Finish Line Checkered Pattern on Right */}
                    <div className="absolute right-0 top-0 bottom-0 w-3 bg-neutral-400/30 dark:bg-neutral-700/40" />

                    {/* Racer car icon progressing */}
                    <div
                      className="absolute transition-all duration-200 text-lg flex items-center"
                      style={{ left: `${Math.min(racer.progress * 0.92, 92)}%` }}
                    >
                      {racer.avatar}
                    </div>

                    {/* Progress fill */}
                    <div
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        racer.isUser
                          ? 'bg-emerald-500'
                          : 'bg-neutral-400 dark:bg-neutral-600'
                      }`}
                      style={{ width: `${racer.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Hidden input for user key capture */}
            <input
              ref={inputRef}
              type="text"
              className="opacity-0 absolute pointer-events-none -z-10"
              onKeyDown={handleKeyDown}
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
            />

            {/* Race Text Box */}
            <div
              onClick={() => inputRef.current?.focus()}
              className={`
                p-6 rounded-2xl border cursor-text bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-lg sm:text-xl leading-relaxed
                ${isRtl ? 'text-right' : 'text-left font-code'}
              `}
              style={{ direction: isRtl ? 'rtl' : 'ltr' }}
            >
              {raceText.split('').map((char, index) => {
                const isTyped = index < typed.length;
                const isCurrent = index === typed.length;

                let charStyle = 'text-neutral-400 dark:text-neutral-600';
                if (isTyped) {
                  charStyle = 'text-emerald-500 font-bold';
                }

                return (
                  <span
                    key={index}
                    className={`relative ${charStyle} ${char === ' ' ? 'inline-block w-2' : ''}`}
                  >
                    {isCurrent && (
                      <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-emerald-500 animate-caret" />
                    )}
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Results Podium & restart */}
            {gameState === 'finished' && (
              <div className="p-6 bg-gradient-to-b from-amber-500/10 to-transparent dark:from-amber-500/15 rounded-2xl border border-amber-500/30 text-center space-y-4">
                <div className="inline-flex p-3 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <Medal className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  مسابقه به پایان رسید!
                </h3>

                {/* Final Rankings */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 max-w-xl mx-auto text-sm">
                  {racers.map((racer, idx) => (
                    <div
                      key={racer.id}
                      className={`p-3 rounded-xl border ${
                        racer.isUser
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      <div className="text-base mb-1">{idx === 0 ? '🥇 اول' : idx === 1 ? '🥈 دوم' : idx === 2 ? '🥉 سوم' : '۴ام'}</div>
                      <div className="text-xs truncate">{racer.name}</div>
                      <div className="text-xs font-mono mt-1 opacity-80">{racer.currentWpm} WPM</div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={startMatchmaking}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-semibold text-sm shadow-md transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>مسابقه مجدد</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
