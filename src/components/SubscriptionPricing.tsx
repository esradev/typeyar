import React from 'react';
import { SubscriptionPlan } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/plans';
import { Check, Sparkles, Zap, Crown, ShieldCheck } from 'lucide-react';

interface SubscriptionPricingProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
  currentPlanId?: string;
  isSubscribed?: boolean;
}

export const SubscriptionPricing: React.FC<SubscriptionPricingProps> = ({
  onSelectPlan,
  currentPlanId,
  isSubscribed,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-4">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-bold">
          <Crown className="w-3.5 h-3.5" />
          <span>پلن‌های عضویت و اشتراک تایپ‌یار</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
          سرعت تایپ خود را چند برابر کنید
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          ۳ درس نخست تمام دوره‌ها <strong className="text-emerald-600 dark:text-emerald-400">کاملاً رایگان</strong> است. با ارتقا به حساب VIP، قفل تمامی دوره‌های پیشرفته، کدنویسی، آزمون‌های اختصاصی و مسابقات باز می‌شود.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = currentPlanId === plan.id && isSubscribed;

          return (
            <div
              key={plan.id}
              className={`
                relative rounded-2xl p-6 transition-all flex flex-col justify-between
                ${
                  plan.isPopular
                    ? 'bg-white dark:bg-neutral-900 border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 -translate-y-1'
                    : 'bg-white/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800'
                }
              `}
            >
              {/* Popular ribbon */}
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-md shadow-emerald-600/30">
                  پیشنهاد اکثر کاربران
                </div>
              )}

              <div>
                {/* Plan header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-extrabold text-neutral-900 dark:text-neutral-100">
                    {plan.title}
                  </h3>
                  {plan.discountBadge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      {plan.discountBadge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                  دوره تمدید: {plan.periodText}
                </p>

                {/* Price block */}
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800/80 mb-5 text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-black text-neutral-900 dark:text-neutral-100 font-mono">
                      {plan.price.toLocaleString('fa-IR')}
                    </span>
                    <span className="text-xs text-neutral-500 font-normal">تومان</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="text-xs text-neutral-400 line-through font-mono mt-0.5">
                      {plan.originalPrice.toLocaleString('fa-IR')} تومان
                    </div>
                  )}
                </div>

                {/* Features list */}
                <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-right">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() => onSelectPlan(plan)}
                  className={`
                    w-full py-3 px-4 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2
                    ${
                      isCurrent
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 cursor-default'
                        : plan.isPopular
                        ? 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-600/25'
                        : 'bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900'
                    }
                  `}
                >
                  {isCurrent ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>اشتراک فعال شما</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>انتخاب پلن و پرداخت</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee banner */}
      <div className="mt-8 p-4 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>گارانتی بازگشت ۱۰۰٪ وجه تا ۷ روز در صورت عدم رضایت از آموزش‌ها</span>
        </div>
        <div className="flex items-center gap-3">
          <span>پشتیبانی شبانه‌روزی</span>
          <span>•</span>
          <span>اتصال به کلیه کارت‌های بانکی عضو شتاب</span>
        </div>
      </div>
    </div>
  );
};
