import React, { useState } from 'react';
import { SubscriptionPlan, UserAccount, PaymentTransaction } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/plans';
import { addTransaction, setCurrentUser } from '../utils/storage';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Building,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  selectedPlan: SubscriptionPlan | null;
  currentUser: UserAccount | null;
  onClose: () => void;
  onOpenAuth: () => void;
  onSuccess: (updatedUser: UserAccount, tx: PaymentTransaction) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  selectedPlan,
  currentUser,
  onClose,
  onOpenAuth,
  onSuccess,
}) => {
  const [activeGateway, setActiveGateway] = useState<'zarinpal' | 'mellat' | 'saman'>('zarinpal');
  const [cardNumber, setCardNumber] = useState('6037991823456789');
  const [cvv2, setCvv2] = useState('789');
  const [expireMonth, setExpireMonth] = useState('08');
  const [expireYear, setExpireYear] = useState('06');
  const [dynamicPass, setDynamicPass] = useState('482910');
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState<number>(0);
  const [discountError, setDiscountError] = useState<string | null>(null);

  const [step, setStep] = useState<'review' | 'gateway' | 'processing' | 'success'>('review');
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);

  if (!isOpen || !selectedPlan) return null;

  // Pricing math
  const originalAmount = selectedPlan.price;
  const finalAmount = Math.max(0, originalAmount - discountApplied);

  const handleApplyDiscount = () => {
    setDiscountError(null);
    if (!discountCode.trim()) return;

    if (discountCode.trim().toUpperCase() === 'TYPEYAR20') {
      const discount = Math.round(originalAmount * 0.2);
      setDiscountApplied(discount);
    } else if (discountCode.trim().toUpperCase() === 'NOROOZ') {
      const discount = Math.round(originalAmount * 0.3);
      setDiscountApplied(discount);
    } else {
      setDiscountError('کد تخفیف وارد شده معتبر یا فعال نیست.');
    }
  };

  const handleStartPayment = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setStep('gateway');
  };

  const handleProcessPayment = () => {
    setStep('processing');

    setTimeout(() => {
      const txId = `tx-${Date.now()}`;
      const trackingCode = `TRX-${Math.floor(10000 + Math.random() * 90000)}`;

      // Calculate expiry duration
      let durationDays = 30;
      if (selectedPlan.id === 'yearly') durationDays = 365;
      if (selectedPlan.id === 'lifetime') durationDays = 365 * 10;

      const updatedUser: UserAccount = {
        ...currentUser!,
        subscription: {
          planId: selectedPlan.id,
          planTitle: selectedPlan.title,
          startDate: Date.now(),
          expiresAt: Date.now() + 1000 * 60 * 60 * 24 * durationDays,
          isActive: true,
          autoRenew: true,
        },
      };

      const newTx: PaymentTransaction = {
        id: txId,
        trackingCode,
        userId: currentUser!.id,
        userName: currentUser!.fullName,
        userEmail: currentUser!.email,
        planId: selectedPlan.id,
        planTitle: selectedPlan.title,
        amount: finalAmount,
        status: 'successful',
        gateway: activeGateway,
        createdAt: Date.now(),
        cardNumberMasked: `${cardNumber.slice(0, 4)}-${cardNumber.slice(4, 6)}**-****-${cardNumber.slice(-4)}`,
      };

      addTransaction(newTx);
      setCurrentUser(updatedUser);
      setCompletedTx(newTx);
      setStep('success');
      onSuccess(updatedUser, newTx);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-right">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {step === 'gateway'
                  ? 'درگاه امن شاپرک'
                  : step === 'success'
                  ? 'پرداخت موفق و فعال‌سازی'
                  : 'تکمیل سفارش و ارتقای حساب'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {selectedPlan.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            ✕
          </button>
        </div>

        {/* STEP 1: REVIEW & CHECKOUT SUMMARY */}
        {step === 'review' && (
          <div className="p-6 space-y-5">
            {/* User Check Alert */}
            {!currentUser && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>برای انتساب اشتراک به حسابتان، ابتدا باید وارد شوید یا عضو شوید.</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold shrink-0 transition-colors shadow-xs"
                >
                  ورود / عضویت
                </button>
              </div>
            )}

            {/* Plan Info Card */}
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/70">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    {selectedPlan.periodText}
                  </span>
                  <h4 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 mt-1">
                    {selectedPlan.title}
                  </h4>
                </div>
                <div className="text-left">
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {selectedPlan.price.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
                  </div>
                  {selectedPlan.originalPrice && (
                    <div className="text-xs text-neutral-400 line-through font-mono">
                      {selectedPlan.originalPrice.toLocaleString('fa-IR')} تومان
                    </div>
                  )}
                </div>
              </div>

              <ul className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700/60 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                {selectedPlan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Discount Code Input */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                کد تخفیف دارید؟ (تست: <span className="font-mono font-bold text-emerald-600">TYPEYAR20</span> یا <span className="font-mono font-bold text-emerald-600">NOROOZ</span>)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="کد تخفیف را وارد کنید"
                  className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-left font-mono uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyDiscount}
                  className="px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-xs font-bold transition-colors"
                >
                  اعمال کد
                </button>
              </div>
              {discountError && (
                <p className="text-xs text-rose-500 mt-1">{discountError}</p>
              )}
              {discountApplied > 0 && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                  مبلغ {discountApplied.toLocaleString('fa-IR')} تومان تخفیف روی سفارش اعمال شد.
                </p>
              )}
            </div>

            {/* Gateway Selector */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                انتخاب درگاه پرداخت الکترونیک شاپرک:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'zarinpal', name: 'زرین‌پال', desc: 'اتصال سریع به تمامی کارت‌ها' },
                  { id: 'mellat', name: 'به‌پرداخت ملت', desc: 'درگاه رسمی بانک ملت' },
                  { id: 'saman', name: 'سامان‌کیش', desc: 'پرداخت الکترونیک سامان' },
                ].map((gw) => (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => setActiveGateway(gw.id as any)}
                    className={`p-3 rounded-xl border text-right transition-all ${
                      activeGateway === gw.id
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                        : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40 hover:border-neutral-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
                      <span>{gw.name}</span>
                      {activeGateway === gw.id && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      )}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{gw.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Final Total Box */}
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">مبلغ قابل پرداخت نهایی:</span>
                <div className="text-xl font-black text-neutral-900 dark:text-neutral-100 font-mono">
                  {finalAmount.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartPayment}
                className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                <span>انتقال به درگاه پرداخت</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SIMULATED SHAPARAK GATEWAY */}
        {step === 'gateway' && (
          <div className="p-6 space-y-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-500" />
                <span>شبیه‌ساز درگاه امن شاپرک ({activeGateway === 'zarinpal' ? 'زرین‌پال' : activeGateway === 'mellat' ? 'بانک ملت' : 'سامان‌کیش'})</span>
              </div>
              <span className="font-mono text-[11px] font-bold">shaparak.ir</span>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-500">پذیرنده:</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">سامانه آموزش تایپ ده‌انگشتی تایپ‌یار</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-500">مبلغ تراکنش:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                  {finalAmount.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              {/* Card inputs */}
              <div className="space-y-2.5 pt-1">
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">شماره کارت ۱۶ رقمی</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono text-sm text-center tracking-widest"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">کد CVV2</label>
                    <input
                      type="password"
                      value={cvv2}
                      onChange={(e) => setCvv2(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono text-sm text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">ماه انقضا</label>
                    <input
                      type="text"
                      value={expireMonth}
                      onChange={(e) => setExpireMonth(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono text-sm text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">سال انقضا</label>
                    <input
                      type="text"
                      value={expireYear}
                      onChange={(e) => setExpireYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono text-sm text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">رمز اینترنتی پویا (رمز دوم)</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={dynamicPass}
                      onChange={(e) => setDynamicPass(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono text-sm text-center tracking-wider"
                    />
                    <button
                      type="button"
                      className="px-3 py-2 text-xs rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium"
                    >
                      دریافت رمز پویا
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('review')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                انصراف و بازگشت
              </button>

              <button
                type="button"
                onClick={handleProcessPayment}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>پرداخت و بازگشت به تایپ‌یار</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PROCESSING SPINNER */}
        {step === 'processing' && (
          <div className="p-12 text-center space-y-4">
            <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin mx-auto" />
            <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              در حال تایید تراکنش بانکی...
            </h4>
            <p className="text-xs text-neutral-500">
              لطفاً صفحه را نبندید؛ تا چند لحظه دیگر اشتراک شما فعال خواهد شد.
            </p>
          </div>
        )}

        {/* STEP 4: SUCCESS RECEIPT */}
        {step === 'success' && completedTx && (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-neutral-900 dark:text-neutral-100">
                پرداخت با موفقیت انجام شد!
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                اشتراک ویژه شما بلافاصله فعال شد و قفل تمامی دروس و امکانات تخصصی باز گردید.
              </p>
            </div>

            {/* Receipt Details */}
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-right space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">کد رهگیری تراکنش:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{completedTx.trackingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">پلن فعال‌شده:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{completedTx.planTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">مبلغ پرداختی:</span>
                <span className="font-mono font-bold">{completedTx.amount.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">وضعیت دسترسی:</span>
                <span className="text-emerald-600 font-bold">کامل و نامحدود</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20"
            >
              شروع تمرین و استفاده از دروس ویژه
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
