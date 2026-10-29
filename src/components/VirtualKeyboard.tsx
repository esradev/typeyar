import React, { useState, useEffect } from 'react';
import { FingerType, KeyInfo, Language } from '../types';
import { getLayoutForLanguage, findKeyForChar, FINGER_COLORS } from '../data/keyboardLayouts';
import { Keyboard as KeyboardIcon, Eye, EyeOff } from 'lucide-react';

interface VirtualKeyboardProps {
  language: Language;
  nextChar: string | null;
  activeKeyCodes: Set<string>;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  language,
  nextChar,
  activeKeyCodes,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const layout = getLayoutForLanguage(language);

  // Identify which key is needed next
  const targetInfo = nextChar ? findKeyForChar(nextChar, language) : { key: null, needsShift: false };
  const targetKey = targetInfo.key;
  const needsShift = targetInfo.needsShift;

  const targetFinger: FingerType | null = targetKey ? targetKey.finger : null;
  const fingerColor = targetFinger ? FINGER_COLORS[targetFinger] : null;

  return (
    <div className="w-full max-w-4xl mx-auto my-3 select-none transition-all duration-300">
      {/* Keyboard Header bar */}
      <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-neutral-100/80 dark:bg-neutral-900/60 rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 text-xs">
        <div className="flex items-center gap-2">
          <KeyboardIcon className="w-4 h-4 text-emerald-500" />
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            صفحه‌کلید مجازی هوشمند ({language === 'fa' ? 'فارسی' : language === 'en' ? 'انگلیسی' : language === 'ar' ? 'عربی' : 'برنامه‌نویسی'})
          </span>
          {targetKey && fingerColor && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium text-[11px] bg-white dark:bg-neutral-800 shadow-xs border border-neutral-200/80 dark:border-neutral-700/80">
              <span className={`w-2 h-2 rounded-full ${fingerColor.dot}`} />
              <span className="text-neutral-600 dark:text-neutral-300">انگشت پیشنهادی: </span>
              <strong className={fingerColor.text}>{fingerColor.label}</strong>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors"
          title={isCollapsed ? 'نمایش کیبورد' : 'مخفی‌سازی کیبورد'}
        >
          {isCollapsed ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span className="text-[11px]">{isCollapsed ? 'نمایش کیبورد' : 'جمع کردن'}</span>
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-2 sm:p-3 bg-neutral-100/90 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-inner">
          <div className="flex flex-col gap-1.5 text-xs sm:text-sm font-code dir-ltr" style={{ direction: 'ltr' }}>
            {layout.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-1 sm:gap-1.5 justify-center w-full">
                {row.map((key) => {
                  const isTarget = targetKey?.code === key.code;
                  const isShiftHighlight = needsShift && (key.code === 'ShiftLeft' || key.code === 'ShiftRight');
                  const isPhysicallyPressed = activeKeyCodes.has(key.code);
                  const finger = FINGER_COLORS[key.finger];

                  // Determine appearance
                  let keyStyle = 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 shadow-xs';

                  if (isPhysicallyPressed) {
                    keyStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-95 transition-transform duration-75';
                  } else if (isTarget || isShiftHighlight) {
                    keyStyle = 'bg-emerald-500 text-white border-emerald-400 ring-2 ring-emerald-400/50 shadow-md animate-pulse';
                  } else if (key.isSpecial) {
                    keyStyle = 'bg-neutral-200/70 dark:bg-neutral-850 text-neutral-500 dark:text-neutral-400 border-neutral-300/60 dark:border-neutral-700/60 text-[10px] sm:text-xs font-sans';
                  }

                  return (
                    <div
                      key={key.code}
                      className={`
                        ${key.width || 'flex-1'}
                        min-w-[20px] sm:min-w-[34px] h-8 sm:h-11
                        rounded-lg border
                        flex flex-col items-center justify-center
                        transition-colors duration-100 relative
                        ${keyStyle}
                      `}
                    >
                      {/* Top finger indicator dot on resting row or target keys */}
                      {key.finger && (
                        <span
                          className={`absolute top-1 left-1 w-1.5 h-1.5 rounded-full ${finger?.dot} opacity-60`}
                          title={finger?.label}
                        />
                      )}

                      {/* Shift label */}
                      {key.shiftLabel && (
                        <span className="text-[9px] sm:text-[10px] opacity-40 leading-none">
                          {key.shiftLabel}
                        </span>
                      )}

                      {/* Main key label */}
                      <span className="font-semibold text-xs sm:text-sm leading-none mt-0.5">
                        {key.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Finger guide palette legend */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mt-2.5 pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50 text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">راهنمای انگشتان:</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>کوچک چپ</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>حلقه چپ</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>میانی چپ</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500"></span>اشاره چپ</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>شست‌ها</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500"></span>اشاره راست</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500"></span>میانی راست</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500"></span>حلقه راست</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-fuchsia-500"></span>کوچک راست</span>
          </div>
        </div>
      )}
    </div>
  );
};
