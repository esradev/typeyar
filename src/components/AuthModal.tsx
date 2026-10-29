import React, { useState } from 'react';
import { UserAccount } from '../types';
import { getAllUsers, saveAllUsers, setCurrentUser } from '../utils/storage';
import { LogIn, UserPlus, Sparkles, AlertCircle, CheckCircle, Shield, ArrowLeft } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const allUsers = getAllUsers();

    if (mode === 'login') {
      if (!email.trim()) {
        setError('لطفاً ایمیل یا شماره موبایل خود را وارد کنید.');
        return;
      }
      // Check if user exists by email or phone
      const found = allUsers.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() ||
          u.phone === email.trim()
      );

      if (found) {
        setSuccessMsg(`خوش آمدید، ${found.fullName}!`);
        setCurrentUser(found);
        setTimeout(() => {
          onSuccess(found);
          onClose();
        }, 600);
      } else {
        // Auto-create or friendly prompt
        setError('کاربری با این مشخصات یافت نشد. می‌توانید با کلیک روی «ثبت نام»، حساب کاربری جدید بسازید.');
      }
    } else {
      // Register
      if (!fullName.trim()) {
        setError('لطفاً نام و نام خانوادگی خود را وارد کنید.');
        return;
      }
      if (!email.trim()) {
        setError('لطفاً ایمیل معتبر وارد کنید.');
        return;
      }

      const exists = allUsers.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (exists) {
        setError('این ایمیل قبلاً در سامانه ثبت شده است. لطفاً وارد شوید.');
        return;
      }

      const newUser: UserAccount = {
        id: `user-${Date.now()}`,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || '۰۹*********',
        role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
        createdAt: Date.now(),
        avatar: '🚀',
        wpmGoal: 50,
      };

      allUsers.push(newUser);
      saveAllUsers(allUsers);
      setCurrentUser(newUser);

      setSuccessMsg('حساب کاربری شما با موفقیت ساخته شد!');
      setTimeout(() => {
        onSuccess(newUser);
        onClose();
      }, 700);
    }
  };

  // Quick Switch for Demo
  const handleQuickLogin = (demoType: 'admin' | 'pro' | 'free') => {
    const allUsers = getAllUsers();
    let target = allUsers.find((u) => u.role === 'admin');
    if (demoType === 'pro') {
      target = allUsers.find((u) => u.subscription?.isActive);
    } else if (demoType === 'free') {
      target = allUsers.find((u) => !u.subscription?.isActive && u.role !== 'admin');
    }

    if (target) {
      setCurrentUser(target);
      setSuccessMsg(`ورود سریع به عنوان: ${target.fullName} (${target.role === 'admin' ? 'مدیر' : target.subscription?.isActive ? 'کاربر VIP' : 'کاربر عادی'})`);
      setTimeout(() => {
        onSuccess(target!);
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 text-right">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
            {mode === 'login' ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
          </div>
          <h3 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100">
            {mode === 'login' ? 'ورود به حساب کاربری' : 'ثبت نام در تایپ‌یار'}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {mode === 'login'
              ? 'برای دسترسی به سوابق، خرید اشتراک و دروس تخصصی وارد شوید'
              : 'شروع سفر ده‌انگشتی با ذخیره ابری پیشرفت و دریافت اشتراک'}
          </p>
        </div>

        {/* Form Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: علی محمدی"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              ایمیل یا شماره موبایل
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com یا 0912..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                شماره موبایل (جهت پیامک رمز و تایید)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{mode === 'login' ? 'ورود به حساب' : 'تکمیل ثبت نام'}</span>
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-center text-xs text-neutral-500">
          {mode === 'login' ? (
            <p>
              حساب کاربری ندارید؟{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                ثبت نام رایگان
              </button>
            </p>
          ) : (
            <p>
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                وارد شوید
              </button>
            </p>
          )}
        </div>

        {/* Quick Demo Accounts Helper */}
        <div className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-700/60">
          <p className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            ورود سریع تستی (یک کلیک):
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 text-xs font-medium hover:bg-indigo-500/20 transition-all flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              ورود مدیر سامانه
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('pro')}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-medium hover:bg-emerald-500/20 transition-all"
            >
              کاربر با اشتراک ویژه
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('free')}
              className="px-2.5 py-1 rounded-lg bg-neutral-200/80 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-all"
            >
              کاربر رایگان
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
