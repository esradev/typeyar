export type Language = 'fa' | 'en' | 'ar' | 'code';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  language: Language;
  targetKeys?: string[];
  content: string;
}

export interface Course {
  id: string;
  title: string;
  language: Language;
  level: CourseLevel;
  iconName: string;
  description: string;
  lessons: Lesson[];
}

export interface PracticeResult {
  id: string;
  timestamp: number;
  wpm: number;
  cpm: number;
  accuracy: number;
  errorCount: number;
  durationSeconds: number;
  language: Language;
  lessonTitle?: string;
  mistakesByChar: Record<string, number>;
}

export type FingerType =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface KeyInfo {
  label: string;
  shiftLabel?: string;
  code: string;
  finger: FingerType;
  width?: string; // e.g. 'flex-[1.5]'
  isSpecial?: boolean;
}

export interface RaceRacer {
  id: string;
  name: string;
  avatar: string;
  isUser: boolean;
  targetWpm: number;
  currentWpm: number;
  progress: number; // 0 to 100
  finished: boolean;
  finishTime?: number;
  rank?: number;
}

export interface OverallStats {
  totalTests: number;
  totalTimeSeconds: number;
  totalCharactersTyped: number;
  bestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
}

export type SubscriptionPlanType = 'monthly' | 'yearly' | 'lifetime';

export interface SubscriptionPlan {
  id: SubscriptionPlanType;
  title: string;
  price: number; // in Tomans
  originalPrice?: number;
  periodText: string;
  features: string[];
  isPopular?: boolean;
  discountBadge?: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: number;
  avatar: string;
  wpmGoal: number;
  subscription?: {
    planId: SubscriptionPlanType;
    planTitle: string;
    startDate: number;
    expiresAt: number; // timestamp
    isActive: boolean;
    autoRenew: boolean;
  };
}

export interface PaymentTransaction {
  id: string;
  trackingCode: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: SubscriptionPlanType;
  planTitle: string;
  amount: number; // in Tomans
  status: 'successful' | 'failed' | 'pending';
  gateway: 'zarinpal' | 'saman' | 'mellat';
  createdAt: number;
  cardNumberMasked?: string;
}
