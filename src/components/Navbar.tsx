import React from 'react';
import {
  Keyboard,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Trophy,
  BarChart3,
  Sliders,
  BookOpen,
  Crown,
  User,
  Shield,
  CreditCard,
  LogIn,
} from 'lucide-react';
import { UserAccount } from '../types';

export type ActiveTab =
  | 'practice'
  | 'courses'
  | 'pricing'
  | 'race'
  | 'custom'
  | 'analytics'
  | 'profile'
  | 'admin';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  bestWpm: number;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  isSubscribed: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  bestWpm,
  currentUser,
  onOpenAuth,
  isSubscribed,
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto pt-4 pb-2 px-3 sm:px-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('practice')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight flex items-center gap-1.5">
              تایپ‌یار
              <span className="text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                ده‌انگشتی
              </span>
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="scrollbar-hide flex min-w-0 items-center gap-1 p-1 bg-neutral-100/90 dark:bg-neutral-800/70 rounded-xl text-xs font-medium overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => onSelectTab('practice')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'practice'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-bold shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            تمرین فعال
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('courses')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'courses'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-bold shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>دوره‌ها</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('pricing')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'pricing'
                ? 'bg-amber-500 text-white font-bold shadow-xs'
                : 'text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>خرید اشتراک</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('race')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'race'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-bold shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>مسابقه</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('custom')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'custom'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-bold shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>شخصی‌سازی</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('analytics')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'analytics'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-bold shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
            <span>پیشرفت</span>
          </button>

          {/* Admin Tab if logged in as admin */}
          {currentUser?.role === 'admin' && (
            <button
              type="button"
              onClick={() => onSelectTab('admin')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>پنل مدیریت</span>
            </button>
          )}
        </nav>

        {/* Right side controls: Profile / Login + Sound + Theme */}
        <div className="flex items-center gap-2">
          {/* User Account Button or Login */}
          {currentUser ? (
            <button
              type="button"
              onClick={() => onSelectTab('profile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-emerald-500'
              }`}
            >
              <span className="text-sm">{currentUser.avatar || '👤'}</span>
              <span className="max-w-[80px] truncate">{currentUser.fullName}</span>
              {isSubscribed && <Crown className="w-3 h-3 text-amber-400 shrink-0" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>ورود / عضویت</span>
            </button>
          )}

          {/* Best WPM Pill */}
          {bestWpm > 0 && (
            <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 font-mono font-bold">
              <span>{bestWpm} WPM</span>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={soundEnabled ? 'قطع صدا' : 'وصل صدای مکانیکی'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title={theme === 'dark' ? 'تم روشن' : 'تم تاریک برای راحتی چشم'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
