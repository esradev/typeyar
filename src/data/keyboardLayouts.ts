import { FingerType, KeyInfo, Language } from '../types';

export const FINGER_COLORS: Record<FingerType, { label: string; bg: string; text: string; dot: string }> = {
  'left-pinky': { label: 'انگشت کوچک چپ', bg: 'bg-rose-500/15 dark:bg-rose-500/25 border-rose-500/40 text-rose-600 dark:text-rose-400', text: 'text-rose-500', dot: 'bg-rose-500' },
  'left-ring': { label: 'انگشت حلقه چپ', bg: 'bg-amber-500/15 dark:bg-amber-500/25 border-amber-500/40 text-amber-600 dark:text-amber-400', text: 'text-amber-500', dot: 'bg-amber-500' },
  'left-middle': { label: 'انگشت میانی چپ', bg: 'bg-emerald-500/15 dark:bg-emerald-500/25 border-emerald-500/40 text-emerald-600 dark:text-emerald-400', text: 'text-emerald-500', dot: 'bg-emerald-500' },
  'left-index': { label: 'انگشت اشاره چپ', bg: 'bg-cyan-500/15 dark:bg-cyan-500/25 border-cyan-500/40 text-cyan-600 dark:text-cyan-400', text: 'text-cyan-500', dot: 'bg-cyan-500' },
  'thumb': { label: 'انگشت شست', bg: 'bg-blue-500/15 dark:bg-blue-500/25 border-blue-500/40 text-blue-600 dark:text-blue-400', text: 'text-blue-500', dot: 'bg-blue-500' },
  'right-index': { label: 'انگشت اشاره راست', bg: 'bg-sky-500/15 dark:bg-sky-500/25 border-sky-500/40 text-sky-600 dark:text-sky-400', text: 'text-sky-500', dot: 'bg-sky-500' },
  'right-middle': { label: 'انگشت میانی راست', bg: 'bg-teal-500/15 dark:bg-teal-500/25 border-teal-500/40 text-teal-600 dark:text-teal-400', text: 'text-teal-500', dot: 'bg-teal-500' },
  'right-ring': { label: 'انگشت حلقه راست', bg: 'bg-violet-500/15 dark:bg-violet-500/25 border-violet-500/40 text-violet-600 dark:text-violet-400', text: 'text-violet-500', dot: 'bg-violet-500' },
  'right-pinky': { label: 'انگشت کوچک راست', bg: 'bg-fuchsia-500/15 dark:bg-fuchsia-500/25 border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400', text: 'text-fuchsia-500', dot: 'bg-fuchsia-500' },
};

// Row definitions for English QWERTY
export const ENGLISH_LAYOUT: KeyInfo[][] = [
  // Number row
  [
    { label: '`', shiftLabel: '~', code: 'Backquote', finger: 'left-pinky' },
    { label: '1', shiftLabel: '!', code: 'Digit1', finger: 'left-pinky' },
    { label: '2', shiftLabel: '@', code: 'Digit2', finger: 'left-ring' },
    { label: '3', shiftLabel: '#', code: 'Digit3', finger: 'left-middle' },
    { label: '4', shiftLabel: '$', code: 'Digit4', finger: 'left-index' },
    { label: '5', shiftLabel: '%', code: 'Digit5', finger: 'left-index' },
    { label: '6', shiftLabel: '^', code: 'Digit6', finger: 'right-index' },
    { label: '7', shiftLabel: '&', code: 'Digit7', finger: 'right-index' },
    { label: '8', shiftLabel: '*', code: 'Digit8', finger: 'right-middle' },
    { label: '9', shiftLabel: '(', code: 'Digit9', finger: 'right-ring' },
    { label: '0', shiftLabel: ')', code: 'Digit0', finger: 'right-pinky' },
    { label: '-', shiftLabel: '_', code: 'Minus', finger: 'right-pinky' },
    { label: '=', shiftLabel: '+', code: 'Equal', finger: 'right-pinky' },
    { label: 'Backspace', code: 'Backspace', finger: 'right-pinky', width: 'flex-[1.6]', isSpecial: true },
  ],
  // Top row
  [
    { label: 'Tab', code: 'Tab', finger: 'left-pinky', width: 'flex-[1.3]', isSpecial: true },
    { label: 'q', shiftLabel: 'Q', code: 'KeyQ', finger: 'left-pinky' },
    { label: 'w', shiftLabel: 'W', code: 'KeyW', finger: 'left-ring' },
    { label: 'e', shiftLabel: 'E', code: 'KeyE', finger: 'left-middle' },
    { label: 'r', shiftLabel: 'R', code: 'KeyR', finger: 'left-index' },
    { label: 't', shiftLabel: 'T', code: 'KeyT', finger: 'left-index' },
    { label: 'y', shiftLabel: 'Y', code: 'KeyY', finger: 'right-index' },
    { label: 'u', shiftLabel: 'U', code: 'KeyU', finger: 'right-index' },
    { label: 'i', shiftLabel: 'I', code: 'KeyI', finger: 'right-middle' },
    { label: 'o', shiftLabel: 'O', code: 'KeyO', finger: 'right-ring' },
    { label: 'p', shiftLabel: 'P', code: 'KeyP', finger: 'right-pinky' },
    { label: '[', shiftLabel: '{', code: 'BracketLeft', finger: 'right-pinky' },
    { label: ']', shiftLabel: '}', code: 'BracketRight', finger: 'right-pinky' },
    { label: '\\', shiftLabel: '|', code: 'Backslash', finger: 'right-pinky', width: 'flex-[1.1]' },
  ],
  // Home row
  [
    { label: 'Caps', code: 'CapsLock', finger: 'left-pinky', width: 'flex-[1.6]', isSpecial: true },
    { label: 'a', shiftLabel: 'A', code: 'KeyA', finger: 'left-pinky' },
    { label: 's', shiftLabel: 'S', code: 'KeyS', finger: 'left-ring' },
    { label: 'd', shiftLabel: 'D', code: 'KeyD', finger: 'left-middle' },
    { label: 'f', shiftLabel: 'F', code: 'KeyF', finger: 'left-index' },
    { label: 'g', shiftLabel: 'G', code: 'KeyG', finger: 'left-index' },
    { label: 'h', shiftLabel: 'H', code: 'KeyH', finger: 'right-index' },
    { label: 'j', shiftLabel: 'J', code: 'KeyJ', finger: 'right-index' },
    { label: 'k', shiftLabel: 'K', code: 'KeyK', finger: 'right-middle' },
    { label: 'l', shiftLabel: 'L', code: 'KeyL', finger: 'right-ring' },
    { label: ';', shiftLabel: ':', code: 'Semicolon', finger: 'right-pinky' },
    { label: "'", shiftLabel: '"', code: 'Quote', finger: 'right-pinky' },
    { label: 'Enter', code: 'Enter', finger: 'right-pinky', width: 'flex-[1.8]', isSpecial: true },
  ],
  // Bottom row
  [
    { label: 'Shift', code: 'ShiftLeft', finger: 'left-pinky', width: 'flex-[2.1]', isSpecial: true },
    { label: 'z', shiftLabel: 'Z', code: 'KeyZ', finger: 'left-pinky' },
    { label: 'x', shiftLabel: 'X', code: 'KeyX', finger: 'left-ring' },
    { label: 'c', shiftLabel: 'C', code: 'KeyC', finger: 'left-middle' },
    { label: 'v', shiftLabel: 'V', code: 'KeyV', finger: 'left-index' },
    { label: 'b', shiftLabel: 'B', code: 'KeyB', finger: 'left-index' },
    { label: 'n', shiftLabel: 'N', code: 'KeyN', finger: 'right-index' },
    { label: 'm', shiftLabel: 'M', code: 'KeyM', finger: 'right-index' },
    { label: ',', shiftLabel: '<', code: 'Comma', finger: 'right-middle' },
    { label: '.', shiftLabel: '>', code: 'Period', finger: 'right-ring' },
    { label: '/', shiftLabel: '?', code: 'Slash', finger: 'right-pinky' },
    { label: 'Shift', code: 'ShiftRight', finger: 'right-pinky', width: 'flex-[2.1]', isSpecial: true },
  ],
  // Space row
  [
    { label: 'Space', code: 'Space', finger: 'thumb', width: 'flex-[8]', isSpecial: false },
  ]
];

// Persian Standard ISIRI layout
export const PERSIAN_LAYOUT: KeyInfo[][] = [
  [
    { label: '÷', shiftLabel: '×', code: 'Backquote', finger: 'left-pinky' },
    { label: '۱', shiftLabel: '!', code: 'Digit1', finger: 'left-pinky' },
    { label: '۲', shiftLabel: '٬', code: 'Digit2', finger: 'left-ring' },
    { label: '۳', shiftLabel: '٫', code: 'Digit3', finger: 'left-middle' },
    { label: '۴', shiftLabel: '﷼', code: 'Digit4', finger: 'left-index' },
    { label: '۵', shiftLabel: '٪', code: 'Digit5', finger: 'left-index' },
    { label: '۶', shiftLabel: '×', code: 'Digit6', finger: 'right-index' },
    { label: '۷', shiftLabel: '،', code: 'Digit7', finger: 'right-index' },
    { label: '۸', shiftLabel: '*', code: 'Digit8', finger: 'right-middle' },
    { label: '۹', shiftLabel: ')', code: 'Digit9', finger: 'right-ring' },
    { label: '۰', shiftLabel: '(', code: 'Digit0', finger: 'right-pinky' },
    { label: '-', shiftLabel: '_', code: 'Minus', finger: 'right-pinky' },
    { label: '=', shiftLabel: '+', code: 'Equal', finger: 'right-pinky' },
    { label: 'Backspace', code: 'Backspace', finger: 'right-pinky', width: 'flex-[1.6]', isSpecial: true },
  ],
  [
    { label: 'Tab', code: 'Tab', finger: 'left-pinky', width: 'flex-[1.3]', isSpecial: true },
    { label: 'ض', shiftLabel: 'ْ', code: 'KeyQ', finger: 'left-pinky' },
    { label: 'ص', shiftLabel: 'ٌ', code: 'KeyW', finger: 'left-ring' },
    { label: 'ث', shiftLabel: 'ٍ', code: 'KeyE', finger: 'left-middle' },
    { label: 'ق', shiftLabel: 'ً', code: 'KeyR', finger: 'left-index' },
    { label: 'ف', shiftLabel: 'ُ', code: 'KeyT', finger: 'left-index' },
    { label: 'غ', shiftLabel: 'ِ', code: 'KeyY', finger: 'right-index' },
    { label: 'ع', shiftLabel: 'َ', code: 'KeyU', finger: 'right-index' },
    { label: 'ه', shiftLabel: 'ّ', code: 'KeyI', finger: 'right-middle' },
    { label: 'خ', shiftLabel: ']', code: 'KeyO', finger: 'right-ring' },
    { label: 'ح', shiftLabel: '[', code: 'KeyP', finger: 'right-pinky' },
    { label: 'ج', shiftLabel: '}', code: 'BracketLeft', finger: 'right-pinky' },
    { label: 'چ', shiftLabel: '{', code: 'BracketRight', finger: 'right-pinky' },
    { label: 'پ', shiftLabel: '|', code: 'Backslash', finger: 'right-pinky', width: 'flex-[1.1]' },
  ],
  [
    { label: 'Caps', code: 'CapsLock', finger: 'left-pinky', width: 'flex-[1.6]', isSpecial: true },
    { label: 'ش', shiftLabel: 'ؤ', code: 'KeyA', finger: 'left-pinky' },
    { label: 'س', shiftLabel: 'ئ', code: 'KeyS', finger: 'left-ring' },
    { label: 'ی', shiftLabel: 'ي', code: 'KeyD', finger: 'left-middle' },
    { label: 'ب', shiftLabel: 'إ', code: 'KeyF', finger: 'left-index' },
    { label: 'ل', shiftLabel: 'أ', code: 'KeyG', finger: 'left-index' },
    { label: 'ا', shiftLabel: 'آ', code: 'KeyH', finger: 'right-index' },
    { label: 'ت', shiftLabel: 'ة', code: 'KeyJ', finger: 'right-index' },
    { label: 'ن', shiftLabel: '«', code: 'KeyK', finger: 'right-middle' },
    { label: 'م', shiftLabel: '»', code: 'KeyL', finger: 'right-ring' },
    { label: 'ک', shiftLabel: ':', code: 'Semicolon', finger: 'right-pinky' },
    { label: 'گ', shiftLabel: '؛', code: 'Quote', finger: 'right-pinky' },
    { label: 'Enter', code: 'Enter', finger: 'right-pinky', width: 'flex-[1.8]', isSpecial: true },
  ],
  [
    { label: 'Shift', code: 'ShiftLeft', finger: 'left-pinky', width: 'flex-[2.1]', isSpecial: true },
    { label: 'ظ', shiftLabel: 'ك', code: 'KeyZ', finger: 'left-pinky' },
    { label: 'ط', shiftLabel: 'ٓ', code: 'KeyX', finger: 'left-ring' },
    { label: 'ز', shiftLabel: 'ژ', code: 'KeyC', finger: 'left-middle' },
    { label: 'ر', shiftLabel: 'ٰ', code: 'KeyV', finger: 'left-index' },
    { label: 'ذ', shiftLabel: '‌', code: 'KeyB', finger: 'left-index' },
    { label: 'د', shiftLabel: 'ٔ', code: 'KeyN', finger: 'right-index' },
    { label: 'پ', shiftLabel: 'ء', code: 'KeyM', finger: 'right-index' },
    { label: 'و', shiftLabel: '>', code: 'Comma', finger: 'right-middle' },
    { label: '.', shiftLabel: '<', code: 'Period', finger: 'right-ring' },
    { label: '/', shiftLabel: '؟', code: 'Slash', finger: 'right-pinky' },
    { label: 'Shift', code: 'ShiftRight', finger: 'right-pinky', width: 'flex-[2.1]', isSpecial: true },
  ],
  [
    { label: 'فاصله (Space)', code: 'Space', finger: 'thumb', width: 'flex-[8]', isSpecial: false },
  ]
];

// Arabic Standard layout
export const ARABIC_LAYOUT: KeyInfo[][] = [
  [
    { label: 'ذ', shiftLabel: 'ّ', code: 'Backquote', finger: 'left-pinky' },
    { label: '1', shiftLabel: '!', code: 'Digit1', finger: 'left-pinky' },
    { label: '2', shiftLabel: '@', code: 'Digit2', finger: 'left-ring' },
    { label: '3', shiftLabel: '#', code: 'Digit3', finger: 'left-middle' },
    { label: '4', shiftLabel: '$', code: 'Digit4', finger: 'left-index' },
    { label: '5', shiftLabel: '%', code: 'Digit5', finger: 'left-index' },
    { label: '6', shiftLabel: '^', code: 'Digit6', finger: 'right-index' },
    { label: '7', shiftLabel: '&', code: 'Digit7', finger: 'right-index' },
    { label: '8', shiftLabel: '*', code: 'Digit8', finger: 'right-middle' },
    { label: '9', shiftLabel: ')', code: 'Digit9', finger: 'right-ring' },
    { label: '0', shiftLabel: '(', code: 'Digit0', finger: 'right-pinky' },
    { label: '-', shiftLabel: '_', code: 'Minus', finger: 'right-pinky' },
    { label: '=', shiftLabel: '+', code: 'Equal', finger: 'right-pinky' },
    { label: 'Backspace', code: 'Backspace', finger: 'right-pinky', width: 'flex-[1.6]', isSpecial: true },
  ],
  [
    { label: 'Tab', code: 'Tab', finger: 'left-pinky', width: 'flex-[1.3]', isSpecial: true },
    { label: 'ض', shiftLabel: 'َ', code: 'KeyQ', finger: 'left-pinky' },
    { label: 'ص', shiftLabel: 'ً', code: 'KeyW', finger: 'left-ring' },
    { label: 'ث', shiftLabel: 'ُ', code: 'KeyE', finger: 'left-middle' },
    { label: 'ق', shiftLabel: 'ٌ', code: 'KeyR', finger: 'left-index' },
    { label: 'ف', shiftLabel: 'لإ', code: 'KeyT', finger: 'left-index' },
    { label: 'غ', shiftLabel: 'إ', code: 'KeyY', finger: 'right-index' },
    { label: 'ع', shiftLabel: '‘', code: 'KeyU', finger: 'right-index' },
    { label: 'ه', shiftLabel: '÷', code: 'KeyI', finger: 'right-middle' },
    { label: 'خ', shiftLabel: '×', code: 'KeyO', finger: 'right-ring' },
    { label: 'ح', shiftLabel: '؛', code: 'KeyP', finger: 'right-pinky' },
    { label: 'ج', shiftLabel: '<', code: 'BracketLeft', finger: 'right-pinky' },
    { label: 'د', shiftLabel: '>', code: 'BracketRight', finger: 'right-pinky' },
    { label: '\\', shiftLabel: '|', code: 'Backslash', finger: 'right-pinky', width: 'flex-[1.1]' },
  ],
  [
    { label: 'Caps', code: 'CapsLock', finger: 'left-pinky', width: 'flex-[1.6]', isSpecial: true },
    { label: 'ش', shiftLabel: 'ِ', code: 'KeyA', finger: 'left-pinky' },
    { label: 'س', shiftLabel: 'ٍ', code: 'KeyS', finger: 'left-ring' },
    { label: 'ي', shiftLabel: ']', code: 'KeyD', finger: 'left-middle' },
    { label: 'ب', shiftLabel: '[', code: 'KeyF', finger: 'left-index' },
    { label: 'ل', shiftLabel: 'لأ', code: 'KeyG', finger: 'left-index' },
    { label: 'ا', shiftLabel: 'أ', code: 'KeyH', finger: 'right-index' },
    { label: 'ت', shiftLabel: 'ـ', code: 'KeyJ', finger: 'right-index' },
    { label: 'ن', shiftLabel: '،', code: 'KeyK', finger: 'right-middle' },
    { label: 'م', shiftLabel: '/', code: 'KeyL', finger: 'right-ring' },
    { label: 'ك', shiftLabel: ':', code: 'Semicolon', finger: 'right-pinky' },
    { label: 'ط', shiftLabel: '"', code: 'Quote', finger: 'right-pinky' },
    { label: 'Enter', code: 'Enter', finger: 'right-pinky', width: 'flex-[1.8]', isSpecial: true },
  ],
  [
    { label: 'Shift', code: 'ShiftLeft', finger: 'left-pinky', width: 'flex-[2.1]', isSpecial: true },
    { label: 'ئ', shiftLabel: '~', code: 'KeyZ', finger: 'left-pinky' },
    { label: 'ء', shiftLabel: 'ْ', code: 'KeyX', finger: 'left-ring' },
    { label: 'ؤ', shiftLabel: '}', code: 'KeyC', finger: 'left-middle' },
    { label: 'ر', shiftLabel: '{', code: 'KeyV', finger: 'left-index' },
    { label: 'لا', shiftLabel: 'لآ', code: 'KeyB', finger: 'left-index' },
    { label: 'ى', shiftLabel: 'آ', code: 'KeyN', finger: 'right-index' },
    { label: 'ة', shiftLabel: '’', code: 'KeyM', finger: 'right-index' },
    { label: 'و', shiftLabel: ',', code: 'Comma', finger: 'right-middle' },
    { label: 'ز', shiftLabel: '.', code: 'Period', finger: 'right-ring' },
    { label: 'ظ', shiftLabel: '؟', code: 'Slash', finger: 'right-pinky' },
    { label: 'Shift', code: 'ShiftRight', finger: 'right-pinky', width: 'flex-[2.1]', isSpecial: true },
  ],
  [
    { label: 'مسافة', code: 'Space', finger: 'thumb', width: 'flex-[8]', isSpecial: false },
  ]
];

export function getLayoutForLanguage(lang: Language): KeyInfo[][] {
  switch (lang) {
    case 'fa':
      return PERSIAN_LAYOUT;
    case 'ar':
      return ARABIC_LAYOUT;
    case 'code':
    case 'en':
    default:
      return ENGLISH_LAYOUT;
  }
}

export function findKeyForChar(char: string, lang: Language): { key: KeyInfo | null; needsShift: boolean } {
  const layout = getLayoutForLanguage(lang);
  
  if (char === ' ') {
    return {
      key: { label: 'Space', code: 'Space', finger: 'thumb' },
      needsShift: false
    };
  }

  // Search each row
  for (const row of layout) {
    for (const key of row) {
      if (key.label === char || key.label.toLowerCase() === char.toLowerCase()) {
        const needsShift = key.shiftLabel === char || (key.label !== char && key.shiftLabel?.toLowerCase() === char.toLowerCase());
        return { key, needsShift };
      }
      if (key.shiftLabel === char) {
        return { key, needsShift: true };
      }
    }
  }

  // Fallback to English layout if not found (common for symbols in Persian/Arabic lessons)
  for (const row of ENGLISH_LAYOUT) {
    for (const key of row) {
      if (key.label === char || key.label.toLowerCase() === char.toLowerCase()) {
        return { key, needsShift: false };
      }
      if (key.shiftLabel === char) {
        return { key, needsShift: true };
      }
    }
  }

  return { key: null, needsShift: false };
}
