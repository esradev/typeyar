import React, { useState } from 'react';
import { PracticeResult, OverallStats } from '../types';
import { calculateOverallStats, getWeakKeys } from '../utils/storage';
import { TrendingUp, Zap, Target, Clock, Calendar, Trash2, Award, CheckCircle2 } from 'lucide-react';

interface ProgressAnalyticsProps {
  results: PracticeResult[];
  onClearHistory?: () => void;
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  results,
  onClearHistory,
}) => {
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const stats = calculateOverallStats(results);
  const weakKeys = getWeakKeys(results, 8);

  // Take the last 15 tests in chronological order for chart display
  const chartData = [...results].reverse().slice(-15);

  // SVG Chart calculation
  const chartHeight = 180;
  const chartWidth = 600;
  const padding = 40;

  const maxWpm = Math.max(...chartData.map((d) => d.wpm), 60);
  const minWpm = 0;

  const getX = (index: number) => {
    if (chartData.length <= 1) return padding + (chartWidth - 2 * padding) / 2;
    return padding + (index / (chartData.length - 1)) * (chartWidth - 2 * padding);
  };

  const getY = (val: number) => {
    const range = maxWpm - minWpm || 1;
    const norm = (val - minWpm) / range;
    return chartHeight - padding - norm * (chartHeight - 2 * padding);
  };

  // Generate SVG path for WPM
  const wpmPoints = chartData.map((d, i) => `${getX(i)},${getY(d.wpm)}`).join(' ');
  const areaPoints = chartData.length > 0
    ? `${getX(0)},${chartHeight - padding} ${wpmPoints} ${getX(chartData.length - 1)},${chartHeight - padding}`
    : '';

  return (
    <div className="w-full max-w-5xl mx-auto py-2 space-y-6">
      {/* Overall Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">بهترین سرعت (Best WPM)</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {stats.bestWpm}
          </div>
          <span className="text-[11px] text-neutral-400">کلمه در دقیقه</span>
        </div>

        <div className="p-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">میانگین سرعت (Avg WPM)</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {stats.avgWpm}
          </div>
          <span className="text-[11px] text-neutral-400">میانگین کل تمرین‌ها</span>
        </div>

        <div className="p-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <div className="flex items-center gap-2 text-teal-500 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">میانگین دقت</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {stats.avgAccuracy}%
          </div>
          <span className="text-[11px] text-neutral-400">صحت کاراکترها</span>
        </div>

        <div className="p-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <div className="flex items-center gap-2 text-blue-500 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">زمان کل تمرین</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            {Math.round(stats.totalTimeSeconds / 60)}
          </div>
          <span className="text-[11px] text-neutral-400">دقیقه تمرین فعال</span>
        </div>
      </div>

      {/* Interactive Progress Chart */}
      <div className="p-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              نمودار پیشرفت سرعت تایپ (WPM Trend)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              روند رشد سرعت شما در آخرین آزمون‌ها
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> سرعت (WPM)
            </span>
            <span className="text-neutral-400">
              {results.length} آزمون ثبت‌شده
            </span>
          </div>
        </div>

        {chartData.length >= 2 ? (
          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-44 sm:h-56 overflow-visible"
            >
              <defs>
                <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 0.33, 0.66, 1].map((ratio) => {
                const yVal = chartHeight - padding - ratio * (chartHeight - 2 * padding);
                const wpmVal = Math.round(minWpm + ratio * (maxWpm - minWpm));
                return (
                  <g key={ratio}>
                    <line
                      x1={padding}
                      y1={yVal}
                      x2={chartWidth - padding}
                      y2={yVal}
                      stroke="currentColor"
                      strokeDasharray="4 4"
                      className="text-neutral-200 dark:text-neutral-800"
                    />
                    <text
                      x={padding - 8}
                      y={yVal + 3}
                      textAnchor="end"
                      className="text-[10px] fill-neutral-400 font-mono"
                    >
                      {wpmVal}
                    </text>
                  </g>
                );
              })}

              {/* Gradient area */}
              {areaPoints && (
                <polygon points={areaPoints} fill="url(#wpmGradient)" />
              )}

              {/* Line path */}
              <polyline
                points={wpmPoints}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data dots */}
              {chartData.map((d, idx) => {
                const cx = getX(idx);
                const cy = getY(d.wpm);
                const isHovered = hoveredPointIndex === idx;

                return (
                  <g
                    key={d.id}
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 6 : 4}
                      className="fill-white dark:fill-neutral-900 stroke-emerald-500 transition-all duration-150"
                      strokeWidth={isHovered ? 3 : 2}
                    />
                    {isHovered && (
                      <g>
                        <rect
                          x={cx - 35}
                          y={cy - 30}
                          width="70"
                          height="22"
                          rx="6"
                          className="fill-neutral-900 dark:fill-white"
                        />
                        <text
                          x={cx}
                          y={cy - 16}
                          textAnchor="middle"
                          className="text-[10px] font-bold font-mono fill-white dark:fill-neutral-900"
                        >
                          {d.wpm} WPM ({d.accuracy}%)
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          <div className="py-12 text-center text-neutral-400 text-sm">
            برای رسم نمودار پیشرفت، لطفاً حداقل ۲ تمرین انجام دهید.
          </div>
        )}
      </div>

      {/* Weak Keys Heatmap and Breakdown */}
      <div className="p-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1 flex items-center gap-2">
          <Target className="w-5 h-5 text-rose-500" />
          تحلیل خطاهای کلیدها (Weak Keys Analysis)
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
          کلیدهایی که در آن‌ها بیشترین تعداد اشتباه تایپی را داشته‌اید:
        </p>

        {weakKeys.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {weakKeys.map(({ char, count }) => (
              <div
                key={char}
                className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-rose-500/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 flex items-center justify-center font-mono font-bold text-base text-neutral-800 dark:text-neutral-100 shadow-2xs">
                    {char === ' ' ? '␣' : char}
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      {char === ' ' ? 'کلید فاصله' : `کلید "${char}"`}
                    </div>
                    <div className="text-[11px] text-rose-500">
                      {count} بار اشتباه
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-neutral-400 text-xs">
            هنوز خطایی ثبت نشده است؛ کار شما عالی است!
          </div>
        )}
      </div>

      {/* Recent sessions list */}
      <div className="p-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            تاریخچه آخرین جلسات تمرین
          </h3>

          {results.length > 0 && onClearHistory && (
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs text-neutral-400 hover:text-rose-500 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>پاک کردن تاریخچه</span>
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400">
                  <th className="py-2.5 font-medium">عنوان تمرین</th>
                  <th className="py-2.5 font-medium">زبان</th>
                  <th className="py-2.5 font-medium">سرعت (WPM)</th>
                  <th className="py-2.5 font-medium">دقت</th>
                  <th className="py-2.5 font-medium">تعداد خطا</th>
                  <th className="py-2.5 font-medium">زمان</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono">
                {results.slice(0, 10).map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                    <td className="py-2.5 font-sans font-medium text-neutral-800 dark:text-neutral-200">
                      {r.lessonTitle || 'تمرین آزاد'}
                    </td>
                    <td className="py-2.5 uppercase text-neutral-500">
                      {r.language}
                    </td>
                    <td className="py-2.5 font-bold text-emerald-600 dark:text-emerald-400">
                      {r.wpm}
                    </td>
                    <td className="py-2.5 text-neutral-700 dark:text-neutral-300">
                      {r.accuracy}%
                    </td>
                    <td className="py-2.5 text-rose-500">
                      {r.errorCount}
                    </td>
                    <td className="py-2.5 text-neutral-400">
                      {r.durationSeconds}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-neutral-400 text-xs">
            هنوز تمرینی انجام نداده‌اید.
          </div>
        )}
      </div>
    </div>
  );
};
