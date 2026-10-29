import React, { useState } from 'react';
import { Course, CourseLevel, Language, Lesson } from '../types';
import { COURSES } from '../data/courses';
import { isLessonFree } from '../utils/storage';
import {
  Sparkles,
  Zap,
  Award,
  Code,
  CheckCircle2,
  ChevronLeft,
  BookOpen,
  Lock,
  Crown,
} from 'lucide-react';

interface CourseSelectorProps {
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  activeLesson: Lesson | null;
  onSelectLesson: (lesson: Lesson) => void;
  completedLessonIds: Set<string>;
  hasSubscription: boolean;
  onRequireSubscription: () => void;
}

export const CourseSelector: React.FC<CourseSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
  activeLesson,
  onSelectLesson,
  completedLessonIds,
  hasSubscription,
  onRequireSubscription,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | 'all'>('all');

  // Filter courses by language and level
  const filteredCourses = COURSES.filter((c) => {
    if (c.language !== selectedLanguage) return false;
    if (selectedLevel !== 'all' && c.level !== selectedLevel) return false;
    return true;
  });

  const getLevelBadge = (level: CourseLevel) => {
    switch (level) {
      case 'beginner':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-3 h-3" />
            مبتدی
          </span>
        );
      case 'intermediate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <Zap className="w-3 h-3" />
            متوسط
          </span>
        );
      case 'advanced':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30">
            <Award className="w-3 h-3" />
            پیشرفته
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-2">
      {/* Header filter controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 p-4 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80">
        {/* Language Tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl">
          <button
            type="button"
            onClick={() => onSelectLanguage('fa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedLanguage === 'fa'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            🇮🇷 فارسی
          </button>
          <button
            type="button"
            onClick={() => onSelectLanguage('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedLanguage === 'en'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            🇬🇧 English
          </button>
          <button
            type="button"
            onClick={() => onSelectLanguage('ar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedLanguage === 'ar'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            🇸🇦 عربی
          </button>
          <button
            type="button"
            onClick={() => onSelectLanguage('code')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedLanguage === 'code'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>برنامه‌نویسی</span>
          </button>
        </div>

        {/* Level filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-neutral-500 dark:text-neutral-400 font-medium">سطح دوره:</span>
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedLevel === lvl
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {lvl === 'all'
                ? 'همه سطوح'
                : lvl === 'beginner'
                ? 'مبتدی'
                : lvl === 'intermediate'
                ? 'متوسط'
                : 'پیشرفته'}
            </button>
          ))}
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="p-5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs"
          >
            {/* Course header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {course.description}
                  </p>
                </div>
              </div>
              <div>{getLevelBadge(course.level)}</div>
            </div>

            {/* Lessons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {course.lessons.map((lesson, index) => {
                const isCurrent = activeLesson?.id === lesson.id;
                const isDone = completedLessonIds.has(lesson.id);
                const isFree = isLessonFree(index);
                const isLocked = !isFree && !hasSubscription;

                return (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      if (isLocked) {
                        onRequireSubscription();
                      } else {
                        onSelectLesson(lesson);
                      }
                    }}
                    className={`
                      p-3.5 rounded-xl border cursor-pointer transition-all text-right relative
                      ${
                        isLocked
                          ? 'bg-neutral-100/50 dark:bg-neutral-900/40 border-neutral-200/50 dark:border-neutral-800/60 opacity-85 hover:border-amber-500/50'
                          : isCurrent
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500/60 ring-2 ring-emerald-500/30 shadow-xs'
                          : 'bg-neutral-50/70 dark:bg-neutral-800/40 border-neutral-200/60 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/80'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-neutral-400 font-mono">
                            {index + 1}.
                          </span>
                          <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            {lesson.title}
                          </h4>
                          {isFree ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              رایگان
                            </span>
                          ) : isLocked ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                              <Lock className="w-2.5 h-2.5" />
                              ویژه اشتراک
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                              <Crown className="w-2.5 h-2.5" />
                              VIP
                            </span>
                          )}
                          {isDone && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                          {lesson.description}
                        </p>
                      </div>

                      {isLocked ? (
                        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 self-center">
                          <Lock className="w-4 h-4" />
                        </div>
                      ) : (
                        <ChevronLeft className="w-4 h-4 text-neutral-400 shrink-0 self-center" />
                      )}
                    </div>

                    {/* Target Keys Tags if specified */}
                    {lesson.targetKeys && lesson.targetKeys.length > 0 && (
                      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-neutral-400">کلیدهای هدف:</span>
                        {lesson.targetKeys.map((k) => (
                          <span
                            key={k}
                            className="px-1.5 py-0.5 rounded-md bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600 text-[11px] font-mono font-bold"
                          >
                            {k === ' ' ? 'Space' : k}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
