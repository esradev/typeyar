import React, { useState } from 'react';
import { Language } from '../types';
import { Sliders, Sparkles, FileText, AlertCircle, Play } from 'lucide-react';

interface CustomPracticeProps {
  weakKeys: { char: string; count: number }[];
  onStartCustomPractice: (content: string, language: Language, title: string) => void;
}

const SAMPLE_WORD_BANKS: Record<Language, { easy: string[]; medium: string[]; hard: string[] }> = {
  fa: {
    easy: ['توت', 'نان', 'سیب', 'آب', 'باد', 'دست', 'شیر', 'شام', 'مادر', 'پدر', 'روز', 'شب', 'کار'],
    medium: ['دانشجو', 'مهربان', 'روشنایی', 'پشتکار', 'اندیشه', 'فرصت', 'استعداد', 'کامیابی', 'طبیعت', 'آرامش'],
    hard: ['مستمسک', 'قسطنطنیه', 'فوق‌العاده', 'روان‌شناختی', 'استراتژیک', 'هم‌افزایی', 'تحول‌آفرین', 'بی‌همتا'],
  },
  en: {
    easy: ['the', 'and', 'for', 'you', 'can', 'see', 'day', 'get', 'use', 'man', 'new', 'one', 'way'],
    medium: ['keyboard', 'practice', 'accuracy', 'computer', 'learning', 'standard', 'velocity', 'champion'],
    hard: ['phenomenon', 'synchronous', 'algorithmic', 'development', 'extraordinary', 'infrastructure'],
  },
  ar: {
    easy: ['قلم', 'كتاب', 'علم', 'عمل', 'أمل', 'نور', 'يوم', 'بيت', 'وطن', 'بحر'],
    medium: ['المعرفة', 'النجاح', 'الاجتهاد', 'المستقبل', 'التطوير', 'الفصاحة', 'البلاغة'],
    hard: ['المستشرقون', 'الاستراتيجية', 'الميكانيكية', 'الاستكشافات', 'التكنولوجية'],
  },
  code: {
    easy: ['let a = 1;', 'const b = 2;', 'return x;', 'if (ok) {}', 'console.log()'],
    medium: ['function add(x, y) { return x + y; }', 'const list = items.filter(x => x.active);'],
    hard: ['export async function handler<T>(req: Request): Promise<Response<T>> { ... }'],
  },
};

export const CustomPractice: React.FC<CustomPracticeProps> = ({
  weakKeys,
  onStartCustomPractice,
}) => {
  const [lang, setLang] = useState<Language>('fa');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [wordCount, setWordCount] = useState<number>(25);
  const [customInputText, setCustomInputText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'smart' | 'custom'>('smart');

  // Generate drill for weak keys
  const generateWeakKeyDrill = () => {
    if (weakKeys.length === 0) {
      alert('هنوز کلید خطایی ثبت نشده است! چند تمرین انجام دهید تا کلیدهای ضعیف شما شناسایی شوند.');
      return;
    }

    const chars = weakKeys.slice(0, 4).map((k) => k.char);
    let drill = '';
    for (let i = 0; i < 20; i++) {
      const w = [
        chars[Math.floor(Math.random() * chars.length)],
        chars[Math.floor(Math.random() * chars.length)],
        chars[Math.floor(Math.random() * chars.length)],
      ].join('');
      drill += (i === 0 ? '' : ' ') + w;
    }

    onStartCustomPractice(
      drill,
      lang,
      `تمرین هوشمند رفع خطای کلیدهای (${chars.join('، ')})`
    );
  };

  // Generate word practice based on selected difficulty & count
  const handleGenerateWordDrill = () => {
    const bank = SAMPLE_WORD_BANKS[lang][difficulty];
    const words: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(bank[Math.floor(Math.random() * bank.length)]);
    }
    const text = words.join(' ');
    const diffLabel = difficulty === 'easy' ? 'آسان' : difficulty === 'medium' ? 'متوسط' : 'چالش‌برانگیز';
    onStartCustomPractice(text, lang, `تمرین شخصی‌سازی‌شده (${diffLabel} - ${wordCount} کلمه)`);
  };

  // Start with custom pasted text
  const handleStartPastedText = () => {
    if (!customInputText.trim()) return;
    onStartCustomPractice(customInputText.trim(), lang, 'تمرین با متن دلخواه');
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2">
      <div className="p-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/60 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                شخصی‌سازی هوشمند تمرین‌ها
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                طراحی تمرین متناسب با سطح مهارت، هدف‌گیری نقاط ضعف، یا بارگذاری متن دلخواه
              </p>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('smart')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'smart'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>تمرین هوشمند و سطح مهارت</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'custom'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>متن دلخواه شما</span>
            </button>
          </div>
        </div>

        {/* Language Choice */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            زبان تمرین:
          </span>
          <div className="flex gap-1.5 text-xs">
            {(['fa', 'en', 'ar', 'code'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-lg border transition-all ${
                  lang === l
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {l === 'fa' ? 'فارسی' : l === 'en' ? 'English' : l === 'ar' ? 'عربی' : 'کدنویسی'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'smart' ? (
          <div className="space-y-6">
            {/* Weak Keys Drill Box */}
            {weakKeys.length > 0 && (
              <div className="p-4 bg-amber-500/5 dark:bg-amber-500/10 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    تمرین رفع خطای کلیدهای ضعیف (شخصی‌سازی شده بر اساس تاریخچه شما)
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    بیشترین خطاها در کلیدهای:
                    <span className="font-mono font-bold mr-1 text-rose-500">
                      {weakKeys.map((k) => ` [${k.char === ' ' ? 'Space' : k.char}] `)}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={generateWeakKeyDrill}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>شروع تمرین کلیدهای ضعیف</span>
                </button>
              </div>
            )}

            {/* Custom generator parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Difficulty */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60 space-y-2">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  سطح دشواری کلمات:
                </label>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        difficulty === d
                          ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {d === 'easy' ? 'ساده' : d === 'medium' ? 'متوسط' : 'چالش‌برانگیز'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length / Word count */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60 space-y-2">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  طول تمرین (تعداد کلمات):
                </label>
                <div className="flex gap-2">
                  {[15, 25, 45, 70].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setWordCount(count)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all ${
                        wordCount === count
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      {count} کلمه
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateWordDrill}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>تولید و شروع تمرین شخصی</span>
            </button>
          </div>
        ) : (
          /* Custom text area */
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                متن، مقاله یا کد مورد نظر خود را در این بخش جای‌گذاری (Paste) کنید:
              </label>
              <textarea
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                placeholder="مثلاً یک پاراگراف از کتاب مورد علاقه‌تان یا کدهای پایتون خود را اینجا کپی کنید..."
                rows={5}
                className="w-full p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                style={{ direction: lang === 'fa' || lang === 'ar' ? 'rtl' : 'ltr' }}
              />
            </div>

            <button
              type="button"
              disabled={!customInputText.trim()}
              onClick={handleStartPastedText}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>شروع تایپ این متن</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
