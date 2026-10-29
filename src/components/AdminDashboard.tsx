import React, { useState } from 'react';
import { UserAccount, PaymentTransaction, SubscriptionPlanType } from '../types';
import {
  getAllUsers,
  saveAllUsers,
  getAllTransactions,
  addTransaction,
} from '../utils/storage';
import {
  ShieldAlert,
  Users,
  CreditCard,
  TrendingUp,
  DollarSign,
  Crown,
  Search,
  CheckCircle,
  XCircle,
  PlusCircle,
  RefreshCw,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToApp: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
  const [users, setUsers] = useState<UserAccount[]>(getAllUsers());
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(getAllTransactions());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'transactions' | 'settings'>('overview');

  // Stats calculation
  const totalUsersCount = users.length;
  const vipUsersCount = users.filter((u) => u.subscription?.isActive || u.role === 'admin').length;
  const successfulTxs = transactions.filter((t) => t.status === 'successful');
  const totalRevenue = successfulTxs.reduce((sum, t) => sum + t.amount, 0);

  // Toggle VIP status for user
  const handleToggleVip = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        const currentlyVip = u.subscription?.isActive;
        return {
          ...u,
          subscription: currentlyVip
            ? undefined
            : {
                planId: 'yearly' as SubscriptionPlanType,
                planTitle: 'اشتراک ۱ ساله حرفه‌ای (اعطا توسط مدیر)',
                startDate: Date.now(),
                expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 365,
                isActive: true,
                autoRenew: true,
              },
        };
      }
      return u;
    });

    setUsers(updated);
    saveAllUsers(updated);
  };

  // Toggle user role (user <-> admin)
  const handleToggleAdmin = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          role: u.role === 'admin' ? ('user' as const) : ('admin' as const),
        };
      }
      return u;
    });

    setUsers(updated);
    saveAllUsers(updated);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery)
  );

  return (
    <div className="w-full max-w-5xl mx-auto py-2 space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight">داشبورد مدیریت و نظارت سامانه</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500 text-white">
                Admin Panel
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              مدیریت کاربران، اشتراک‌ها، تراکنش‌های مالی و دسترسی به دوره‌ها
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToApp}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all border border-white/15"
        >
          بازگشت به برنامه اصلی
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white/80 dark:bg-neutral-900/80 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>درآمد ناخالص کل</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-neutral-900 dark:text-neutral-100 font-mono">
            {totalRevenue.toLocaleString('fa-IR')} <span className="text-xs font-normal text-neutral-400">تومان</span>
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">
            {successfulTxs.length} تراکنش موفق پرداختی
          </div>
        </div>

        <div className="p-4 bg-white/80 dark:bg-neutral-900/80 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>کاربران دارای اشتراک</span>
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-neutral-900 dark:text-neutral-100 font-mono">
            {vipUsersCount} <span className="text-xs font-normal text-neutral-400">نفر</span>
          </div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
            دسترسی به تمامی دروس پولی
          </div>
        </div>

        <div className="p-4 bg-white/80 dark:bg-neutral-900/80 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>کل حساب‌های ثبت‌شده</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-black text-neutral-900 dark:text-neutral-100 font-mono">
            {totalUsersCount} <span className="text-xs font-normal text-neutral-400">کاربر</span>
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">
            پایگاه داده کاربران فعال
          </div>
        </div>

        <div className="p-4 bg-white/80 dark:bg-neutral-900/80 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
            <span>نرخ تبدیل به اشتراک</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-neutral-900 dark:text-neutral-100 font-mono">
            {totalUsersCount > 0 ? Math.round((vipUsersCount / totalUsersCount) * 100) : 0}٪
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">
            پس از پایان ۳ درس رایگان
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveSection('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'overview'
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          مدیریت کاربران ({users.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'transactions'
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          گزارش تراکنش‌ها و تسویه‌ها ({transactions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'settings'
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          قوانین اشتراک و دروس
        </button>
      </div>

      {/* SECTION 1: USERS MANAGEMENT */}
      {activeSection === 'overview' && (
        <div className="p-5 bg-white/80 dark:bg-neutral-900/80 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 space-y-4">
          {/* Search bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی کاربر با نام، ایمیل یا موبایل..."
                className="w-full pr-9 pl-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <span className="text-xs text-neutral-400">
              نمایش {filteredUsers.length} از {users.length} کاربر
            </span>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400">
                  <th className="py-2.5 px-3 font-medium">کاربر</th>
                  <th className="py-2.5 px-3 font-medium">ایمیل / موبایل</th>
                  <th className="py-2.5 px-3 font-medium">نقش</th>
                  <th className="py-2.5 px-3 font-medium">وضعیت اشتراک</th>
                  <th className="py-2.5 px-3 font-medium">تاریخ عضویت</th>
                  <th className="py-2.5 px-3 font-medium text-left">اقدام مدیریتی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredUsers.map((u) => {
                  const hasVip = u.subscription?.isActive;

                  return (
                    <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{u.avatar || '👤'}</span>
                          <span className="font-bold text-neutral-900 dark:text-neutral-100">
                            {u.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-neutral-700 dark:text-neutral-300 font-mono text-[11px]">
                          {u.email}
                        </div>
                        <div className="text-neutral-400 font-mono text-[10px]">{u.phone}</div>
                      </td>
                      <td className="py-3 px-3">
                        {u.role === 'admin' ? (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 font-bold text-[10px]">
                            مدیر سیستم
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-[10px]">
                            کاربر عادی
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {u.role === 'admin' ? (
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
                            دسترسی نامحدود
                          </span>
                        ) : hasVip ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                            <Crown className="w-3 h-3 text-amber-500" />
                            {u.subscription?.planTitle || 'اشتراک ویژه'}
                          </span>
                        ) : (
                          <span className="text-neutral-400 text-[11px]">رایگان (۳ درس اول)</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-400">
                        {new Date(u.createdAt).toLocaleDateString('fa-IR')}
                      </td>
                      <td className="py-3 px-3 text-left">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleVip(u.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                              hasVip
                                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                            }`}
                          >
                            {hasVip ? 'لغو اشتراک' : 'اعطای اشتراک VIP'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleAdmin(u.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-all"
                          >
                            {u.role === 'admin' ? 'عزل از مدیریت' : 'تبدیل به مدیر'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: TRANSACTIONS & SETTLEMENTS */}
      {activeSection === 'transactions' && (
        <div className="p-5 bg-white/80 dark:bg-neutral-900/80 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              کلیه تراکنش‌های بانکی شاپرک
            </h3>
            <span className="text-xs text-neutral-400">
              مجموع تسویه شده: {totalRevenue.toLocaleString('fa-IR')} تومان
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400">
                  <th className="py-2.5 px-3 font-medium">کد رهگیری</th>
                  <th className="py-2.5 px-3 font-medium">نام خریدار</th>
                  <th className="py-2.5 px-3 font-medium">بسته اشتراکی</th>
                  <th className="py-2.5 px-3 font-medium">مبلغ پرداختی</th>
                  <th className="py-2.5 px-3 font-medium">درگاه بانکی</th>
                  <th className="py-2.5 px-3 font-medium">تاریخ و زمان</th>
                  <th className="py-2.5 px-3 font-medium">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="py-3 px-3 font-mono font-bold text-neutral-800 dark:text-neutral-200">
                      {tx.trackingCode}
                    </td>
                    <td className="py-3 px-3 font-medium text-neutral-900 dark:text-neutral-100">
                      {tx.userName}
                    </td>
                    <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                      {tx.planTitle}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {tx.amount.toLocaleString('fa-IR')} تومان
                    </td>
                    <td className="py-3 px-3 text-neutral-500">
                      {tx.gateway === 'zarinpal' ? 'زرین‌پال' : tx.gateway === 'mellat' ? 'به‌پرداخت ملت' : 'سامان‌کیش'}
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-400">
                      {new Date(tx.createdAt).toLocaleDateString('fa-IR')} - {new Date(tx.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3">
                      {tx.status === 'successful' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                          موفق
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-400">
                          ناموفق
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: SUBSCRIPTION & LESSON RULES */}
      {activeSection === 'settings' && (
        <div className="p-6 bg-white/80 dark:bg-neutral-900/80 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            قوانین دسترسی و مدل کسب‌وکار (Freemium Paywall)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                <CheckCircle className="w-4 h-4" />
                <span>قانون دروس رایگان (Free Tier)</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                سه درس نخست (درس ۱، ۲ و ۳) در تمام دوره‌ها (مقدماتی، متوسط و پیشرفته تمامی زبان‌ها) بدون نیاز به عضویت یا پرداخت برای تمامی مراجعین باز است تا کاربر بتواند کیفیت آموزش را تجربه کند.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                <Crown className="w-4 h-4" />
                <span>قانون دروس پولی (VIP Paywall)</span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                از درس ۴ به بعد در تمام دوره‌ها، نماد قفل طلایی نمایش داده شده و در صورت کلیک، دیالوگ ارتقای اشتراک و انتخاب پلن‌های ماهانه/سالانه/مادام‌العمر باز می‌شود.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
