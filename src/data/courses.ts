import { Course, Language } from '../types';

export const COURSES: Course[] = [
  // ===================== فارسی =====================
  {
    id: 'fa-beginner',
    title: 'مقدماتی فارسی: کلیدهای پایگاه و ردیف میانی',
    language: 'fa',
    level: 'beginner',
    iconName: 'Sparkles',
    description: 'آشنایی با جایگاه انگشتان روی حروف ردیف اصلی (ت، ب، ل، ا، س، ش، م، ن، ک، گ)',
    lessons: [
      {
        id: 'fa-beg-1',
        title: 'درس اول: انگشتان اشاره (ت و ب)',
        description: 'تمرین استقرار انگشتان روی برجستگی‌های کلیدهای ت و ب',
        level: 'beginner',
        language: 'fa',
        targetKeys: ['ت', 'ب', ' '],
        content: 'تت بب تب بت تتت ببب تبتب بت بت تب تب بتبت بت بت تبتب بب تتب ببت تت بب تب بت'
      },
      {
        id: 'fa-beg-2',
        title: 'درس دوم: گسترش به حروف (ا و ل)',
        description: 'تمرین حرکت انگشت اشاره به حروف الف و لام',
        level: 'beginner',
        language: 'fa',
        targetKeys: ['ا', 'ل', 'ت', 'ب'],
        content: 'ال لا لت تل بال تاب لات بال تاب تال بال لا ال تاب بلبل بال تابان لب لت بال'
      },
      {
        id: 'fa-beg-3',
        title: 'درس سوم: انگشتان میانی و حلقه (س، ش، ن، م)',
        description: 'تسلط بر ردیف میانی دست چپ و راست',
        level: 'beginner',
        language: 'fa',
        targetKeys: ['س', 'ش', 'ن', 'م'],
        content: 'من تن سن شن نام سام شام نشان منش تشنه شست ستان سامان شمس نما ماس'
      },
      {
        id: 'fa-beg-4',
        title: 'درس چهارم: کلیدهای پایانی ردیف میانی (ک، گ، ی)',
        description: 'کامل کردن تمام کلیدهای ردیف خانه و ساخت کلمات کامل',
        level: 'beginner',
        language: 'fa',
        targetKeys: ['ک', 'گ', 'ی'],
        content: 'یک گل کم نمگ سنگ رنگ برگ لیگ کمک نمک بیست سیب کیش گرگان گیلان گیاه پاک'
      }
    ]
  },
  {
    id: 'fa-intermediate',
    title: 'متوسط فارسی: ردیف‌های بالا، پایین و واژه‌سازی',
    language: 'fa',
    level: 'intermediate',
    iconName: 'Zap',
    description: 'یادگیری حروف ردیف بالا (ض ص ث ق ف غ ع ه خ ح ج چ) و پایین (ظ ط ز ر ذ د ئ و پ)',
    lessons: [
      {
        id: 'fa-int-1',
        title: 'درس اول: ردیف بالا و حروف ق، ف، غ، ع',
        description: 'تمرین پرش انگشتان به ردیف فوقانی بدون جابجایی دست',
        level: 'intermediate',
        language: 'fa',
        content: 'فوق قلم عقل غار باغ غرفه عمیق علف قفس قافله عطر غربت غزل عقاب قالی فانوس'
      },
      {
        id: 'fa-int-2',
        title: 'درس دوم: ردیف بالا و حروف خ، ح، ج، چ',
        description: 'تسلط بر انگشتان کوچک و انگشتان سمت راست ردیف بالا',
        level: 'intermediate',
        language: 'fa',
        content: 'خوب جهان چتر چای صبح چشمه چراغ خورشید حجاب چشمان خندان جهانگرد چابک'
      },
      {
        id: 'fa-int-3',
        title: 'درس سوم: ردیف پایین (ر، ز، د، ذ، و، پ)',
        description: 'حرکت نرم انگشتان به سمت پایین و حفظ آهنگ تایپ',
        level: 'intermediate',
        language: 'fa',
        content: 'روز پرواز درخت دریا زنبور وزش پروانه دوست دوران پرواز زود دیر پند پیروز'
      },
      {
        id: 'fa-int-4',
        title: 'درس چهارم: جملات روان و نیم‌فاصله',
        description: 'تایپ جملات معنادار روزمره به همراه علائم نگارشی',
        level: 'intermediate',
        language: 'fa',
        content: 'تمرین مداوم رمز موفقیت در تایپ سریع است. هر روز ده دقیقه تمرین کنید تا سرعت خود را دو برابر کنید.'
      }
    ]
  },
  {
    id: 'fa-advanced',
    title: 'پیشرفته فارسی: متون ادبی و سرعت حرفه‌ای',
    language: 'fa',
    level: 'advanced',
    iconName: 'Award',
    description: 'تایپ متون ادبی غنی، اشعار و قطعات تحلیلی با دقت بالاتر از ۹۸ درصد',
    lessons: [
      {
        id: 'fa-adv-1',
        title: 'درس اول: گزیده‌ای از گلستان سعدی',
        description: 'تایپ قطعات کلاسیک با آهنگ کلام و کلمات مرکب',
        level: 'advanced',
        language: 'fa',
        content: 'منت خدای را عز و جل که طاعتش موجب قربت است و به شکر اندرش مزید نعمت. هر نفسی که فرو می‌رود ممد حیات است و چون برمی‌آید مفرح ذات.'
      },
      {
        id: 'fa-adv-2',
        title: 'درس دوم: هنر نوشتن و تفکر نقادانه',
        description: 'تقویت ریتم پیوسته بدون نگاه کردن به صفحه کلید',
        level: 'advanced',
        language: 'fa',
        content: 'یادگیری مهارت‌های نوین در عصر فناوری، افق‌های تازه‌ای برای اندیشیدن می‌گشاید. تسلط بر تایپ ده انگشتی ذهن را از قید مکانیکی کیبورد آزاد ساخته و فرصت خلق افکار خلاقانه را شکوفا می‌سازد.'
      },
      {
        id: 'fa-adv-3',
        title: 'درس سوم: چالش سرعت و استقامت',
        description: 'آزمون تمرکز طولانی مدت بدون افت دقت',
        level: 'advanced',
        language: 'fa',
        content: 'موفقیت پایدار حاصل گام‌های کوچک اما مستمر است. کسی که بر دستان و ذهن خویش مسلط شود، زمان را مهار کرده و بهره‌وری فردی را به اوج می‌رساند.'
      }
    ]
  },

  // ===================== ENGLISH =====================
  {
    id: 'en-beginner',
    title: 'English Beginner: Home Row Mastery',
    language: 'en',
    level: 'beginner',
    iconName: 'Sparkles',
    description: 'Establish anchor finger positions on A S D F and J K L ;',
    lessons: [
      {
        id: 'en-beg-1',
        title: 'Lesson 1: Index Fingers (F and J)',
        description: 'Find the tactile bumps on F and J with your index fingers',
        level: 'beginner',
        language: 'en',
        targetKeys: ['f', 'j', ' '],
        content: 'ff jj fj jf fff jjj fjfj jfjf ff jj fj jf fjjf jffj fj fj jf jf'
      },
      {
        id: 'en-beg-2',
        title: 'Lesson 2: Adding D and K (Middle Fingers)',
        description: 'Integrate middle fingers into home row chords',
        level: 'beginner',
        language: 'en',
        targetKeys: ['d', 'k', 'f', 'j'],
        content: 'dd kk dk kd fjdk kdjf dffk kffd fade deaf fake desk dead flask'
      },
      {
        id: 'en-beg-3',
        title: 'Lesson 3: Complete Home Row (A S D F J K L ;)',
        description: 'Flow smoothly across all 8 home row resting positions',
        level: 'beginner',
        language: 'en',
        targetKeys: ['a', 's', 'l', ';'],
        content: 'asdf jkl; aadd ssll falls salad flasks salsa slash dials flash glad fall'
      },
      {
        id: 'en-beg-4',
        title: 'Lesson 4: Top Row Reach (E and I)',
        description: 'Vowels E and I reached by middle fingers',
        level: 'beginner',
        language: 'en',
        targetKeys: ['e', 'i'],
        content: 'fed kid life file side slide field skies like dislike fake lake leaf'
      }
    ]
  },
  {
    id: 'en-intermediate',
    title: 'English Intermediate: Words & Capitalization',
    language: 'en',
    level: 'intermediate',
    iconName: 'Zap',
    description: 'Transition into standard vocabulary, shift key usage, and punctuation',
    lessons: [
      {
        id: 'en-int-1',
        title: 'Lesson 1: Common English Words',
        description: 'Build muscle memory for frequent word patterns',
        level: 'intermediate',
        language: 'en',
        content: 'the quick brown fox jumps over the lazy dog and runs into the peaceful forest'
      },
      {
        id: 'en-int-2',
        title: 'Lesson 2: Capital Letters & Proper Nouns',
        description: 'Opposite hand Shift coordination for fluid capitalization',
        level: 'intermediate',
        language: 'en',
        content: 'London, Paris, Tokyo and New York are bustling international capitals.'
      },
      {
        id: 'en-int-3',
        title: 'Lesson 3: Numbers and Quotations',
        description: 'Combine number row reach with common quotation marks',
        level: 'intermediate',
        language: 'en',
        content: 'In 2026, over 85% of modern developers practice touch typing to double their output.'
      }
    ]
  },
  {
    id: 'en-advanced',
    title: 'English Advanced: High Speed & Flow',
    language: 'en',
    level: 'advanced',
    iconName: 'Award',
    description: 'Sustain 70+ WPM through complex prose, rhythm, and accuracy',
    lessons: [
      {
        id: 'en-adv-1',
        title: 'Lesson 1: Tech & Philosophy Prose',
        description: 'Uninterrupted long paragraphs for speed endurance',
        level: 'advanced',
        language: 'en',
        content: 'Simplicity is about subtracting the obvious and adding the meaningful. When every keystroke becomes second nature, thoughts translate directly into code without friction.'
      },
      {
        id: 'en-adv-2',
        title: 'Lesson 2: Complex Literary Flow',
        description: 'Nuanced vocabulary with natural punctuation cadence',
        level: 'advanced',
        language: 'en',
        content: 'Curiosity is the engine of achievement. The quiet discipline of daily deliberate practice transforms initial hesitation into effortless mastery.'
      }
    ]
  },

  // ===================== ARABIC =====================
  {
    id: 'ar-beginner',
    title: 'المستوى المبتدئ: صف الارتكاز العربي',
    language: 'ar',
    level: 'beginner',
    iconName: 'Sparkles',
    description: 'التعود على مواقع الحروف الأساسية (ب، ت، ن، ي، ل، ا، ك، م)',
    lessons: [
      {
        id: 'ar-beg-1',
        title: 'الدرس الأول: السبابتين (ت و ب)',
        description: 'تثبيت السبابتين على مفاتيح الارتكاز المركزية',
        level: 'beginner',
        language: 'ar',
        targetKeys: ['ت', 'ب', ' '],
        content: 'تت بب تب بت تتت ببب تبتب بت بت تب تب بتبت بت بت تبتب بب تتب ببت'
      },
      {
        id: 'ar-beg-2',
        title: 'الدرس الثاني: الألف واللام (ا و ل)',
        description: 'حركة السبابة السريعة نحو الألف واللام',
        level: 'beginner',
        language: 'ar',
        targetKeys: ['ا', 'ل', 'ت', 'ب'],
        content: 'ال لا لت تل بال تاب لات بال تاب تال بال لا ال تاب بلبل بال تابان لب'
      },
      {
        id: 'ar-beg-3',
        title: 'الدرس الثالث: صف الارتكاز كاملاً',
        description: 'دمج الشين والسين والياء والباء واللام والألف والتاء والنون',
        level: 'beginner',
        language: 'ar',
        content: 'شمس كتاب قلم نهر سلام بيان جميل نور صباح أمل علم عمل وطن بلد'
      }
    ]
  },
  {
    id: 'ar-intermediate',
    title: 'المستوى المتوسط: الصفوف العلوية والسفلية',
    language: 'ar',
    level: 'intermediate',
    iconName: 'Zap',
    description: 'إتقان الصف العلوي والسفلي مع التاء المربوطة والحروف الممدودة',
    lessons: [
      {
        id: 'ar-int-1',
        title: 'الدرس الأول: الصف العلوي (ق، ف، غ، ع، ه، خ، ح، ج)',
        description: 'التنقل الرشيق بين صف الارتكاز والصف العلوي',
        level: 'intermediate',
        language: 'ar',
        content: 'حق فجر علم غيم خيل حبر جمال فكرة عهد خير جبل حكمة غابة قلم'
      },
      {
        id: 'ar-int-2',
        title: 'الدرس الثاني: حكم وأمثال مأثورة',
        description: 'كتابة جمل عربية كاملة ومعبرة',
        level: 'intermediate',
        language: 'ar',
        content: 'طلب الأدب أولى من طلب الذهب، وحسن الخلق يبلغ بصاحبه درجات الفضل والكمال.'
      }
    ]
  },
  {
    id: 'ar-advanced',
    title: 'المستوى المتقدم: الفصاحة وسرعة الإتقان',
    language: 'ar',
    level: 'advanced',
    iconName: 'Award',
    description: 'نصوص أدبية بليغة تتطلب تركيزاً ودقة عالية وسرعة طباعة مستمرة',
    lessons: [
      {
        id: 'ar-adv-1',
        title: 'الدرس الأول: روائع البلاغة',
        description: 'طباعة متقدمة بدون النظر للوحة المفاتيح',
        level: 'advanced',
        language: 'ar',
        content: 'إن العلم نور يقذفه الله في قلب من يشاء، وما نيل المطالب بالتمني ولكن تؤخذ الدنيا غلاباً بالصبر والمثابرة والعمل الدؤوب.'
      },
      {
        id: 'ar-adv-2',
        title: 'الدرس الثاني: لغة الضاد والإبداع',
        description: 'اختبار دقة الحركات والفواصل',
        level: 'advanced',
        language: 'ar',
        content: 'وسعت كتاب الله لفظاً وغاية، وما ضقت عن آي به وعظات. فكيف أضيق اليوم عن وصف آلة وتنسيق أسماء لمخترعات.'
      }
    ]
  },

  // ===================== PROGRAMMING =====================
  {
    id: 'code-symbols',
    title: 'کدنویسی: نمادها و پرانتزهای کلیدی',
    language: 'code',
    level: 'beginner',
    iconName: 'Code',
    description: 'تسلط بر کلیدهای پرتکرار پرانتزها، آکولادها، کاما و سمی‌کالن ({} [] () ; => ===)',
    lessons: [
      {
        id: 'code-sym-1',
        title: 'درس اول: پرانتزها و براکت‌ها () [] {}',
        description: 'تمرین انگشتان کوچک روی شیفت و پرانتزها',
        level: 'beginner',
        language: 'code',
        targetKeys: ['(', ')', '[', ']', '{', '}'],
        content: '() [] {} () [] {} (x) [0] {id: 1} ([{}]) (a, b) => { return [a, b]; };'
      },
      {
        id: 'code-sym-2',
        title: 'درس دوم: عملگرها و نشانه‌ها (=== !== && || =>)',
        description: 'نمادهای شرطی و مقایسه‌ای پرکاربرد',
        level: 'beginner',
        language: 'code',
        targetKeys: ['=', '!', '&', '|', '>'],
        content: 'const ok = a === b && c !== d || (count >= 10); items.map(x => x.id);'
      }
    ]
  },
  {
    id: 'code-javascript',
    title: 'کدنویسی: جاوااسکریپت و تایپ‌اسکریپت (JS/TS)',
    language: 'code',
    level: 'intermediate',
    iconName: 'Zap',
    description: 'توابع، پرامیس‌ها، آرایه‌ها و الگوهای مدرن در JavaScript',
    lessons: [
      {
        id: 'code-js-1',
        title: 'درس اول: متغیرها و توابع Arrow',
        description: 'تعریف متغیرها و توابع خطی',
        level: 'intermediate',
        language: 'code',
        content: 'const fetchUser = async (id: string): Promise<User> => { const res = await api.get(`/users/${id}`); return res.data; };'
      },
      {
        id: 'code-js-2',
        title: 'درس دوم: کار با آرایه‌ها (map, filter, reduce)',
        description: 'زنجیره‌سازی متدهای آرایه با پرانتز و کرلی‌براکت',
        level: 'intermediate',
        language: 'code',
        content: 'const activeScores = players.filter(p => p.isActive).map(p => p.score * 1.5).reduce((acc, curr) => acc + curr, 0);'
      }
    ]
  },
  {
    id: 'code-python',
    title: 'کدنویسی: پایتون (Python Clean Code)',
    language: 'code',
    level: 'advanced',
    iconName: 'Award',
    description: 'تعریف توابع def، لیست‌ها و دیکشنری‌های پایتونی با دندانه‌گذاری تمیز',
    lessons: [
      {
        id: 'code-py-1',
        title: 'درس اول: توابع و List Comprehension',
        description: 'کدهای خوش‌فرم پایتون با دونقطه و ایندکس‌ها',
        level: 'advanced',
        language: 'code',
        content: 'def calculate_stats(scores: list[int]) -> dict:\n    return {"avg": sum(scores) / len(scores), "max": max(scores)}'
      },
      {
        id: 'code-py-2',
        title: 'درس دوم: کلاس‌ها و مدیریت داده‌ها',
        description: 'کلاس‌های پایتون و متدهای جادویی',
        level: 'advanced',
        language: 'code',
        content: 'class TypingSession:\n    def __init__(self, wpm: float, accuracy: float):\n        self.wpm = wpm\n        self.accuracy = accuracy'
      }
    ]
  }
];
