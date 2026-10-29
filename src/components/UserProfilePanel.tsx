import React, { useState } from 'react';
import { UserAccount, PaymentTransaction, PracticeResult, OverallStats } from '../types';
import { getAllTransactions, setCurrentUser } from '../utils/storage';
import {
  User,
  Crown,
  CreditCard,
  History,
  Shield,
  Calendar,
  Zap,
  TrendingUp,
  Award,
  LogOut,
  Sparkles,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface UserProfilePanelProps {
  currentUser: UserAccount;
  onLogout: () => void;
  onOpenUpgrade: () => void;
  stats: OverallStats;
  recentResults: PracticeResult[];
}

export const UserProfilePanel: React.FC<UserProfilePanelProps> = ({
  currentUser,
  onLogout,
  onOpenUpgrade,
  stats,
  recentResults,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'subscription' | 'invoices'>('profile');

  // Filter user's transactions
  const allTxs = getAllTransactions();
  const userTxs = allTxs.filter((t) => t.userId === currentUser.id);

  const sub = currentUser.subscription;
  const isSubActive = sub && sub.isActive && sub.expiresAt > Date.now();
  const daysLeft = isSubActive
    ? Math.max(0, Math.ceil((sub!.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="w-full max-w-5xl mx-auto py-2 space-y-6">
      {/* Top Banner Card */}
      <div className="p-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
            {currentUser.avatar || '👤'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100">
                {currentUser.fullName}
              </h2>
              {currentUser.role === 'admin' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30">
                  <Shield className="w-3 h-3" />
                  مدیر سیستم
                </span>
              ) : isSubActive ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                  <Crown className="w-3 h-3 text-amber-500" />
                  اشتراک ویژه (VIP)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  کاربر رایگان
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {currentUser.email}
              </span>
              {currentUser.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {currentUser.phone}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                عضویت: {new Date(currentUser.createdAt).toLocaleDateString('fa-IR')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {!isSubActive && currentUser.role !== 'admin' && (
            <button
              type="button"
              onClick={onOpenUpgrade}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all"
            >
              <Crown className="w-4 h-4" />
              <span>ارتقا به حساب ویژه</span>
            </button>
          )}

          <button
            type="button"
            onClick={onLogout}
            className="py-2.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-neutral-700 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج از حساب</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'profile'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          خلاصه وضعیت و آمار
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('subscription')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'subscription'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          وضعیت اشتراک و دسترسی‌ها
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('invoices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'invoices'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          فاکتورها و سوابق مالی ({userTxs.length})
        </button>
      </div>

      {/* TAB 1: SUMMARY & PERFORMANCE */}
      {activeSubTab === 'profile' && (
        <div className="space-y-5">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-white/80 dark:bg-neutral-900/80 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 text-right">
              <span className="text-[11px] text-neutral-400">بهترین سرعت ثبت‌شده</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                {stats.bestWpm} <span className="text-xs font-normal">WPM</span>
              </div>
            </div>
            <div className="p-4 bg-white/80 dark:bg-neutral-900/80 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 text-right">
              <span className="text-[11px] text-neutral-400">میانگین دقت کلی</span>
              <div className="text-2xl font-black text-neutral-800 dark:text-neutral-200 font-mono mt-1">
                {stats.avgAccuracy}٪
              </div>
            </div>
            <div className="p-4 bg-white/80 dark:bg-neutral-900/80 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 text-right">
              <span className="text-[11px] text-neutral-400">تعداد تمرین‌های انجام‌شده</span>
              <div className="text-2xl font-black text-neutral-800 dark:text-neutral-200 font-mono mt-1">
                {stats.totalTests}
              </div>
            </div>
            <div className="p-4 bg-white/80 dark:bg-neutral-900/80 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 text-right">
              <span className="text-[11px] text-neutral-400">کل حروف تایپ‌شده</span>
              <div className="text-2xl font-black text-neutral-800 dark:text-neutral-200 font-mono mt-1">
                {stats.totalCharactersTyped.toLocaleString('fa-IR')}
              </div>
            </div>
          </div>

          {/* Recent sessions */}
          <div className="p-5 bg-white/80 dark:bg-neutral-900/80 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3">
              آخرین جلسات تمرینی شما
            </h3>
            {recentResults.length === 0 ? (
              <p className="text-xs text-neutral-500 py-4 text-center">
                هنوز تمرینی انجام نداده‌اید. به بخش «تمرین فعال» یا «دوره‌ها» بروید و اولین تمرین خود را آغاز کنید!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400">
                      <th className="py-2 px-3 font-medium">درس / تمرین</th>
                      <th className="py-2 px-3 font-medium">سرعت (WPM)</th>
                      <th className="py-2 px-3 font-medium">دقت</th>
                      <th className="py-2 px-3 font-medium">خطاها</th>
                      <th className="py-2 px-3 font-medium">زمان</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {recentResults.slice(0, 5).map((r) => (
                      <tr key={r.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="py-2.5 px-3 font-medium text-neutral-800 dark:text-neutral-200">
                          {r.lessonTitle || 'تمرین آزاد'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {r.wpm}
                        </td>
                        <td className="py-2.5 px-3 font-mono">{r.accuracy}٪</td>
                        <td className="py-2.5 px-3 font-mono text-rose-500">{r.errorCount}</td>
                        <td className="py-2.5 px-3 text-neutral-400 font-mono">
                          {new Date(r.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SUBSCRIPTION DETAILS */}
      {activeSubTab === 'subscription' && (
        <div className="p-6 bg-white/80 dark:bg-neutral-900/80 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <span className="text-xs text-neutral-500">طرح اشتراک فعلی:</span>
              <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-100 mt-0.5">
                {currentUser.role === 'admin'
                  ? 'دسترسی مدیریت با کلیه مجوزهای سامانه'
                  : sub && isSubActive
                  ? sub.planTitle
                  : 'پلن رایگان (دسترسی به ۳ درس اول هر دوره)'}
              </h3>
            </div>

            {isSubActive && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                <span className="font-bold">{daysLeft} روز</span> باقی‌مانده تا تاریخ تمدید
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 space-y-2">
              <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                امکانات فعال حساب شما:
              </h4>
              <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 pr-2">
                <li>• دسترسی به ۳ درس اول تمام دوره‌های فارسی، انگلیسی، عربی و کدنویسی</li>
                {isSubActive || currentUser.role === 'admin' ? (
                  <>
                    <li className="text-emerald-600 dark:text-emerald-400 font-semibold">• دسترسی نامحدود به دروس ۴ به بعد و بخش‌های تخصصی</li>
                    <li className="text-emerald-600 dark:text-emerald-400 font-semibold">• امکان مسابقه آنلاین بدون محدودیت با سایر کاربران</li>
                    <li className="text-emerald-600 dark:text-emerald-400 font-semibold">• تحلیل هوشمند خطای کلیدها و تمرین هدفمند</li>
                    <li className="text-emerald-600 dark:text-emerald-400 font-semibold">• ذخیره‌سازی ابری و بدون انقضای سوابق</li>
                  </>
                ) : (
                  <li className="text-neutral-400">• دروس ۴ به بعد قفل بوده و نیازمند اشتراک ویژه هستند.</li>
                )}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  تمدید یا تغییر پلن اشتراک
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  می‌توانید در هر زمان پلن خود را به سالانه یا مادام‌العمر تغییر داده و از تخفیف‌های ویژه بهره‌مند شوید.
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenUpgrade}
                className="mt-4 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 text-center"
              >
                مشاهده پلن‌ها و خرید اشتراک
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INVOICES & PAYMENTS */}
      {activeSubTab === 'invoices' && (
        <div className="p-5 bg-white/80 dark:bg-neutral-900/80 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3">
            سوابق پرداخت‌ها و تسویه حساب‌ها
          </h3>

          {userTxs.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-xs">
              <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-40" />
              هنوز فاکتور یا پرداختی برای حساب شما ثبت نشده است.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400">
                    <th className="py-2.5 px-3 font-medium">کد رهگیری</th>
                    <th className="py-2.5 px-3 font-medium">شرح بسته</th>
                    <th className="py-2.5 px-3 font-medium">مبلغ</th>
                    <th className="py-2.5 px-3 font-medium">درگاه</th>
                    <th className="py-2.5 px-3 font-medium">شماره کارت</th>
                    <th className="py-2.5 px-3 font-medium">تاریخ</th>
                    <th className="py-2.5 px-3 font-medium">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {userTxs.map((tx) => (
                    <tr key={tx.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="py-3 px-3 font-mono font-bold text-neutral-700 dark:text-neutral-300">
                        {tx.trackingCode}
                      </td>
                      <td className="py-3 px-3 font-medium text-neutral-900 dark:text-neutral-100">
                        {tx.planTitle}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {tx.amount.toLocaleString('fa-IR')} تومان
                      </td>
                      <td className="py-3 px-3 text-neutral-500">
                        {tx.gateway === 'zarinpal' ? 'زرین‌پال' : tx.gateway === 'mellat' ? 'به‌پرداخت ملت' : 'سامان‌کیش'}
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-400">
                        {tx.cardNumberMasked || '---'}
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-400">
                        {new Date(tx.createdAt).toLocaleDateString('fa-IR')}
                      </td>
                      <td className="py-3 px-3">
                        {tx.status === 'successful' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                            موفق
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-400">
                            ناموفق
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
