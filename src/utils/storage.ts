import { PracticeResult, OverallStats, Language, UserAccount, PaymentTransaction, SubscriptionPlanType } from '../types';

const STORAGE_KEY_RESULTS = 'typeyar_practice_results';
const STORAGE_KEY_THEME = 'typeyar_theme';
const STORAGE_KEY_SOUND = 'typeyar_sound_enabled';
const STORAGE_KEY_USER = 'typeyar_user_profile';
const STORAGE_KEY_CURRENT_USER = 'typeyar_current_user';
const STORAGE_KEY_ALL_USERS = 'typeyar_all_users';
const STORAGE_KEY_TRANSACTIONS = 'typeyar_transactions';

export interface UserProfile {
  name: string;
  avatar: string;
  wpmGoal: number;
}

const DEFAULT_USER: UserProfile = {
  name: 'کاربر پرتلاش',
  avatar: '🚀',
  wpmGoal: 50,
};

// Default mock admin and demo users
const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-admin-1',
    fullName: 'مدیر سامانه تایپ‌یار',
    email: 'admin@typeyar.ir',
    phone: '09121112233',
    role: 'admin',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
    avatar: '🛡️',
    wpmGoal: 85,
    subscription: {
      planId: 'lifetime',
      planTitle: 'عضویت دائمی و مادام‌العمر',
      startDate: Date.now() - 1000 * 60 * 60 * 24 * 30,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 365 * 10,
      isActive: true,
      autoRenew: true,
    },
  },
  {
    id: 'user-free-1',
    fullName: 'سارا احمدی',
    email: 'sara@example.com',
    phone: '09351234567',
    role: 'user',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    avatar: '👩‍💻',
    wpmGoal: 45,
  },
  {
    id: 'user-pro-1',
    fullName: 'امیرحسین رضایی',
    email: 'amir@example.com',
    phone: '09198765432',
    role: 'user',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    avatar: '⚡',
    wpmGoal: 70,
    subscription: {
      planId: 'yearly',
      planTitle: 'اشتراک ۱ ساله حرفه‌ای',
      startDate: Date.now() - 1000 * 60 * 60 * 24 * 14,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 351,
      isActive: true,
      autoRenew: true,
    },
  },
];

const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-1001',
    trackingCode: 'TRX-89412',
    userId: 'user-pro-1',
    userName: 'امیرحسین رضایی',
    userEmail: 'amir@example.com',
    planId: 'yearly',
    planTitle: 'اشتراک ۱ ساله حرفه‌ای',
    amount: 490000,
    status: 'successful',
    gateway: 'zarinpal',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    cardNumberMasked: '۶۰۳۷-۹۹**-****-۴۴۵۲',
  },
  {
    id: 'tx-1002',
    trackingCode: 'TRX-94812',
    userId: 'user-admin-1',
    userName: 'مدیر سامانه تایپ‌یار',
    userEmail: 'admin@typeyar.ir',
    planId: 'lifetime',
    planTitle: 'عضویت دائمی و مادام‌العمر',
    amount: 980000,
    status: 'successful',
    gateway: 'mellat',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    cardNumberMasked: '۶۱۰۴-۳۳**-****-۸۸۹۹',
  },
  {
    id: 'tx-1003',
    trackingCode: 'TRX-10928',
    userId: 'user-free-1',
    userName: 'سارا احمدی',
    userEmail: 'sara@example.com',
    planId: 'monthly',
    planTitle: 'اشتراک ۱ ماهه طلایی',
    amount: 99000,
    status: 'failed',
    gateway: 'saman',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    cardNumberMasked: '۵۰۲۲-۲۹**-****-۱۲۰۹',
  },
];

export function getAllUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ALL_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveAllUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(users));
  } catch {
    // Ignore
  }
}

export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!raw) {
      // Default to guest or first non-admin user
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserAccount | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
      // Also update in all users
      const all = getAllUsers();
      const idx = all.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        all[idx] = user;
      } else {
        all.unshift(user);
      }
      saveAllUsers(all);
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    }
  } catch {
    // Ignore
  }
}

export function getAllTransactions(): PaymentTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export function addTransaction(tx: PaymentTransaction): void {
  try {
    const all = getAllTransactions();
    all.unshift(tx);
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(all));
  } catch {
    // Ignore
  }
}

export function isUserSubscribed(user: UserAccount | null): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true; // Admin has full access
  if (!user.subscription) return false;
  if (!user.subscription.isActive) return false;
  return user.subscription.expiresAt > Date.now();
}

export function isLessonFree(lessonIndex: number): boolean {
  // First 3 lessons of every course are free!
  return lessonIndex < 3;
}

export function getSavedResults(): PracticeResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESULTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function savePracticeResult(result: PracticeResult): void {
  try {
    const list = getSavedResults();
    list.unshift(result);
    // Keep last 100 results
    const trimmed = list.slice(0, 100);
    localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(trimmed));
  } catch {
    // Ignore storage quota errors
  }
}

export function calculateOverallStats(results: PracticeResult[]): OverallStats {
  if (results.length === 0) {
    return {
      totalTests: 0,
      totalTimeSeconds: 0,
      totalCharactersTyped: 0,
      bestWpm: 0,
      avgWpm: 0,
      avgAccuracy: 0,
    };
  }

  let totalWpm = 0;
  let totalAcc = 0;
  let bestWpm = 0;
  let totalTime = 0;
  let totalChars = 0;

  for (const r of results) {
    totalWpm += r.wpm;
    totalAcc += r.accuracy;
    totalTime += r.durationSeconds;
    totalChars += Math.round((r.cpm * r.durationSeconds) / 60);
    if (r.wpm > bestWpm) {
      bestWpm = r.wpm;
    }
  }

  return {
    totalTests: results.length,
    totalTimeSeconds: Math.round(totalTime),
    totalCharactersTyped: totalChars,
    bestWpm: Math.round(bestWpm),
    avgWpm: Math.round(totalWpm / results.length),
    avgAccuracy: Math.round(totalAcc / results.length),
  };
}

export function getWeakKeys(results: PracticeResult[], limit = 6): { char: string; count: number }[] {
  const tally: Record<string, number> = {};

  for (const r of results) {
    if (!r.mistakesByChar) continue;
    for (const [char, count] of Object.entries(r.mistakesByChar)) {
      if (char.trim() === '') continue;
      tally[char] = (tally[char] || 0) + count;
    }
  }

  const sorted = Object.entries(tally)
    .map(([char, count]) => ({ char, count }))
    .sort((a, b) => b.count - a.count);

  return sorted.slice(0, limit);
}

export function getSavedTheme(): 'dark' | 'light' {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'dark'; // default to stylish dark theme for eye comfort
  } catch {
    return 'dark';
  }
}

export function saveTheme(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch {
    // Ignore
  }
}

export function getSavedSoundEnabled(): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SOUND);
    return saved === null ? true : saved === 'true';
  } catch {
    return true;
  }
}

export function saveSoundEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY_SOUND, String(enabled));
  } catch {
    // Ignore
  }
}

export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) return DEFAULT_USER;
    return { ...DEFAULT_USER, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USER;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
  } catch {
    // Ignore
  }
}
