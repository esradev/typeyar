import React, { useState, useEffect, useCallback } from 'react';
import { COURSES } from './data/courses';
import { SUBSCRIPTION_PLANS } from './data/plans';
import { Language, Lesson, PracticeResult, UserAccount, SubscriptionPlan, PaymentTransaction } from './types';
import {
  getSavedResults,
  savePracticeResult,
  getSavedTheme,
  saveTheme,
  getSavedSoundEnabled,
  saveSoundEnabled,
  calculateOverallStats,
  getWeakKeys,
  getCurrentUser,
  setCurrentUser,
  isUserSubscribed,
  isLessonFree,
} from './utils/storage';
import { Navbar, ActiveTab } from './components/Navbar';
import { TypingArea } from './components/TypingArea';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { CourseSelector } from './components/CourseSelector';
import { OnlineRace } from './components/OnlineRace';
import { CustomPractice } from './components/CustomPractice';
import { ProgressAnalytics } from './components/ProgressAnalytics';
import { ResultModal } from './components/ResultModal';
import { SubscriptionPricing } from './components/SubscriptionPricing';
import { UserProfilePanel } from './components/UserProfilePanel';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { Sparkles, ChevronRight, ChevronLeft, RotateCcw, Lock, Crown } from 'lucide-react';

export default function App() {
  // Theme & Sound state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // User & Authentication state
  const [currentUser, setLocalCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

  // Checkout & Subscription state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('practice');

  // Course & Lesson state
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('fa');
  const [currentLesson, setCurrentLesson] = useState<Lesson>(COURSES[0].lessons[0]);
  const [customExercise, setCustomExercise] = useState<{
    content: string;
    language: Language;
    title: string;
  } | null>(null);

  // History & Results
  const [results, setResults] = useState<PracticeResult[]>([]);
  const [lastResult, setLastResult] = useState<PracticeResult | null>(null);

  // Virtual Keyboard feedback
  const [nextChar, setNextChar] = useState<string | null>(null);
  const [activeKeyCodes, setActiveKeyCodes] = useState<Set<string>>(new Set());

  // Initialize theme, sound, user and stored results on mount
  useEffect(() => {
    const savedTheme = getSavedTheme();
    setTheme(savedTheme);
    saveTheme(savedTheme);

    const savedSound = getSavedSoundEnabled();
    setSoundEnabled(savedSound);

    const savedResults = getSavedResults();
    setResults(savedResults);

    const user = getCurrentUser();
    setLocalCurrentUser(user);
  }, []);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    saveTheme(next);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    saveSoundEnabled(next);
  };

  // Subscription verification
  const userHasSubscription = isUserSubscribed(currentUser);

  // When a lesson finishes
  const handleCompletePractice = (result: PracticeResult) => {
    savePracticeResult(result);
    setResults((prev) => [result, ...prev]);
    setLastResult(result);
  };

  // Find next lesson
  const getNextLesson = (): { lesson: Lesson; isLocked: boolean } | null => {
    for (const course of COURSES) {
      const idx = course.lessons.findIndex((l) => l.id === currentLesson.id);
      if (idx !== -1) {
        if (idx + 1 < course.lessons.length) {
          const next = course.lessons[idx + 1];
          const isFree = isLessonFree(idx + 1);
          const isLocked = !isFree && !userHasSubscription;
          return { lesson: next, isLocked };
        }
      }
    }
    return null;
  };

  const nextLessonInfo = getNextLesson();

  const handleNextLesson = () => {
    if (nextLessonInfo) {
      if (nextLessonInfo.isLocked) {
        // Prompt checkout
        setSelectedPlan(SUBSCRIPTION_PLANS[1]); // Recommend yearly
        setIsCheckoutOpen(true);
        return;
      }
      setCurrentLesson(nextLessonInfo.lesson);
      setSelectedLanguage(nextLessonInfo.lesson.language);
      setCustomExercise(null);
      setLastResult(null);
      setActiveTab('practice');
    }
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setSelectedLanguage(lesson.language);
    setCustomExercise(null);
    setActiveTab('practice');
  };

  const handleRequireSubscription = (planId?: string) => {
    const chosen = SUBSCRIPTION_PLANS.find((p) => p.id === planId) || SUBSCRIPTION_PLANS[1];
    setSelectedPlan(chosen);
    setIsCheckoutOpen(true);
  };

  const handleStartCustomPractice = (
    content: string,
    language: Language,
    title: string
  ) => {
    setCustomExercise({ content, language, title });
    setSelectedLanguage(language);
    setActiveTab('practice');
  };

  const handlePracticeWeakKeys = (keys: string[]) => {
    let drill = '';
    for (let i = 0; i < 18; i++) {
      const chunk = [
        keys[Math.floor(Math.random() * keys.length)],
        keys[Math.floor(Math.random() * keys.length)],
        keys[Math.floor(Math.random() * keys.length)],
      ].join('');
      drill += (i === 0 ? '' : ' ') + chunk;
    }
    setCustomExercise({
      content: drill,
      language: selectedLanguage,
      title: `تمرین اختصاصی کلیدهای (${keys.join('، ')})`,
    });
    setLastResult(null);
    setActiveTab('practice');
  };

  const handleClearHistory = () => {
    if (confirm('آیا از پاک کردن تمامی تاریخچه تمرین‌ها اطمینان دارید؟')) {
      localStorage.removeItem('typeyar_practice_results');
      setResults([]);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (user: UserAccount) => {
    setLocalCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLocalCurrentUser(null);
    setActiveTab('practice');
  };

  const handleCheckoutSuccess = (updatedUser: UserAccount, tx: PaymentTransaction) => {
    setLocalCurrentUser(updatedUser);
  };

  // Calculate completed lessons from results
  const completedLessonIds = new Set<string>(
    results.map((r) => r.lessonTitle || '').filter(Boolean)
  );

  const stats = calculateOverallStats(results);
  const weakKeys = getWeakKeys(results, 6);

  // Active typing content
  const activeContent = customExercise ? customExercise.content : currentLesson.content;
  const activeTitle = customExercise ? customExercise.title : currentLesson.title;
  const activeLanguage = customExercise ? customExercise.language : currentLesson.language;

  // Determine if active lesson is locked
  const activeLessonIdx = currentLesson
    ? COURSES.flatMap((c) => c.lessons).findIndex((l) => l.id === currentLesson.id)
    : 0;
  // Find index within its own course
  const currentCourse = COURSES.find((c) => c.lessons.some((l) => l.id === currentLesson.id));
  const lessonIdxInCourse = currentCourse
    ? currentCourse.lessons.findIndex((l) => l.id === currentLesson.id)
    : 0;
  const isActiveLessonFree = isLessonFree(lessonIdxInCourse);
  const isActiveLessonLocked = !isActiveLessonFree && !userHasSubscription;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      {/* Top Paywall Banner for free users */}
      {!userHasSubscription && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs py-2 px-3 sm:px-4 text-center font-medium shadow-xs flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>
            ۳ درس اول تمامی دوره‌ها رایگان است. برای دسترسی به دروس ۴ به بعد،{' '}
            <button
              type="button"
              onClick={() => {
                setSelectedPlan(SUBSCRIPTION_PLANS[1]);
                setIsCheckoutOpen(true);
              }}
              className="underline font-bold hover:text-amber-200 transition-colors"
            >
              اشتراک ویژه تایپ‌یار
            </button>{' '}
            را با ۵۰٪ تخفیف ویژه فعال کنید.
          </span>
        </div>
      )}

      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        bestWpm={stats.bestWpm}
        currentUser={currentUser}
        onOpenAuth={() => handleOpenAuth('login')}
        isSubscribed={userHasSubscription}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 flex flex-col items-center">
        {/* TAB 1: PRACTICE & INTERACTIVE TYPING */}
        {activeTab === 'practice' && (
          <div className="w-full flex flex-col items-center space-y-4 animate-fade-in">
            {/* Lesson Title Header */}
            <div className="w-full max-w-4xl flex items-center justify-between px-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {customExercise ? 'تمرین اختصاصی' : isActiveLessonFree ? 'درس رایگان' : 'درس ویژه اشتراک'}
                </span>
                <h2 className="font-bold text-neutral-800 dark:text-neutral-200">
                  {activeTitle}
                </h2>
              </div>

              {!customExercise && nextLessonInfo && (
                <button
                  type="button"
                  onClick={handleNextLesson}
                  className="flex items-center gap-1 text-xs text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <span>
                    درس بعدی: {nextLessonInfo.lesson.title}{' '}
                    {nextLessonInfo.isLocked && '(ویژه)'}
                  </span>
                  {nextLessonInfo.isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <ChevronLeft className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {/* If user navigates directly to a locked lesson without VIP */}
            {isActiveLessonLocked ? (
              <div className="w-full max-w-3xl p-8 my-6 bg-white/90 dark:bg-neutral-900/90 rounded-2xl border-2 border-dashed border-amber-500/50 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100">
                    این درس مخصوص کاربران دارای اشتراک است
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mt-1 leading-relaxed">
                    شما در حال حاضر از پلن رایگان (۳ درس نخست) استفاده می‌کنید. با ارتقا به حساب ویژه، قفل این درس و صدها درس پیشرفته دیگر فوراً باز خواهد شد.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlan(SUBSCRIPTION_PLANS[1]);
                      setIsCheckoutOpen(true);
                    }}
                    className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all"
                  >
                    <Crown className="w-4 h-4 text-amber-300" />
                    <span>خرید اشتراک و بازگشایی آنی</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('courses')}
                    className="py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    انتخاب دروس رایگان ۱ تا ۳
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Typing Area Component */}
                <TypingArea
                  key={activeContent}
                  content={activeContent}
                  language={activeLanguage}
                  lessonTitle={activeTitle}
                  soundEnabled={soundEnabled}
                  onSoundToggle={handleToggleSound}
                  onComplete={handleCompletePractice}
                  onKeyStroke={(char, keyCodes) => {
                    setNextChar(char);
                    setActiveKeyCodes(keyCodes);
                  }}
                />

                {/* Virtual Keyboard Component */}
                <VirtualKeyboard
                  language={activeLanguage}
                  nextChar={nextChar}
                  activeKeyCodes={activeKeyCodes}
                />
              </>
            )}
          </div>
        )}

        {/* TAB 2: COURSE EXPLORER */}
        {activeTab === 'courses' && (
          <CourseSelector
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
            activeLesson={currentLesson}
            onSelectLesson={handleSelectLesson}
            completedLessonIds={completedLessonIds}
            hasSubscription={userHasSubscription}
            onRequireSubscription={() => handleRequireSubscription()}
          />
        )}

        {/* TAB 3: SUBSCRIPTION PRICING PLANS */}
        {activeTab === 'pricing' && (
          <SubscriptionPricing
            onSelectPlan={(plan) => {
              setSelectedPlan(plan);
              setIsCheckoutOpen(true);
            }}
            currentPlanId={currentUser?.subscription?.planId}
            isSubscribed={userHasSubscription}
          />
        )}

        {/* TAB 4: USER PROFILE & ACCOUNT */}
        {activeTab === 'profile' && (
          currentUser ? (
            <UserProfilePanel
              currentUser={currentUser}
              onLogout={handleLogout}
              onOpenUpgrade={() => {
                setSelectedPlan(SUBSCRIPTION_PLANS[1]);
                setIsCheckoutOpen(true);
              }}
              stats={stats}
              recentResults={results}
            />
          ) : (
            <div className="w-full max-w-md my-12 p-8 bg-white/80 dark:bg-neutral-900/80 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold">ورود به پنل کاربری</h3>
              <p className="text-xs text-neutral-500">
                برای مشاهده سوابق، اشتراک‌ها و گزارش‌های پیشرفت ابتدا وارد حساب خود شوید.
              </p>
              <button
                type="button"
                onClick={() => handleOpenAuth('login')}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                ورود یا ثبت نام
              </button>
            </div>
          )
        )}

        {/* TAB 5: ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          currentUser?.role === 'admin' ? (
            <AdminDashboard onBackToApp={() => setActiveTab('practice')} />
          ) : (
            <div className="w-full max-w-md my-12 p-8 bg-white/80 dark:bg-neutral-900/80 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold">دسترسی محدود به مدیران</h3>
              <p className="text-xs text-neutral-500">
                برای مشاهده داشبورد مدیریت باید با حساب ادمین وارد سامانه شوید. (می‌توانید در بخش ورود، دکمه ورود سریع مدیر را بزنید).
              </p>
              <button
                type="button"
                onClick={() => handleOpenAuth('login')}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                ورود به عنوان مدیر
              </button>
            </div>
          )
        )}

        {/* TAB 6: ONLINE RACE ARENA */}
        {activeTab === 'race' && (
          <OnlineRace
            userDisplayName={currentUser ? currentUser.fullName : 'شما'}
            soundEnabled={soundEnabled}
            onRaceFinish={handleCompletePractice}
          />
        )}

        {/* TAB 7: CUSTOM PRACTICE GENERATOR */}
        {activeTab === 'custom' && (
          <CustomPractice
            weakKeys={weakKeys}
            onStartCustomPractice={handleStartCustomPractice}
          />
        )}

        {/* TAB 8: PROGRESS ANALYTICS & CHARTS */}
        {activeTab === 'analytics' && (
          <ProgressAnalytics
            results={results}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Post-lesson Result Modal */}
      {lastResult && (
        <ResultModal
          result={lastResult}
          onRetry={() => setLastResult(null)}
          onNextLesson={handleNextLesson}
          onPracticeWeakKeys={handlePracticeWeakKeys}
          hasNextLesson={Boolean(nextLessonInfo)}
        />
      )}

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authInitialMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Checkout & Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        selectedPlan={selectedPlan}
        currentUser={currentUser}
        onClose={() => setIsCheckoutOpen(false)}
        onOpenAuth={() => {
          setIsCheckoutOpen(false);
          handleOpenAuth('login');
        }}
        onSuccess={handleCheckoutSuccess}
      />

      {/* Minimal Zen Footer */}
      <footer className="w-full max-w-5xl mx-auto py-3 px-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 gap-2">
        <div className="flex items-center gap-3">
          <span>آموزش تایپ ده‌انگشتی تایپ‌یار</span>
          <span>•</span>
          <span>۳ درس اول رایگان + اشتراک حرفه‌ای</span>
        </div>
        <div className="flex items-center gap-3">
          <span>پشتیبانی شتاب و شاپرک</span>
          <span>•</span>
          <span>داشبورد پیشرفته مدیریت</span>
        </div>
      </footer>
    </div>
  );
}
