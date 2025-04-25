
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available languages
type Language = 'en' | 'ar';

// Translation dictionaries
const translations = {
  en: {
    'Dashboard': 'Dashboard',
    'Study Zone': 'Study Zone',
    'My Documents': 'My Documents',
    'Achievements': 'Achievements',
    'Leaderboards': 'Leaderboards',
    'Settings': 'Settings',
    'Need help?': 'Need help?',
    'Check our tutorials or contact support.': 'Check our tutorials or contact support.',
    'View tutorials': 'View tutorials',
    'Ahmed Mohammed': 'Ahmed Mohammed',
    'Profile': 'Profile',
    'Help & Support': 'Help & Support',
    'Log out': 'Log out',
    'This semester': 'This semester',
    'Study Streak': 'Study Streak',
    'Documents Processed': 'Documents Processed',
    'Points Earned': 'Points Earned',
    'Upload New Document': 'Upload New Document',
    'Your longest streak was 12 days': 'Your longest streak was 12 days',
    'You\'re in the top 10%': 'You\'re in the top 10%',
    'Search documents...': 'Search documents...',
    'Filter': 'Filter',
    'pages': 'pages',
    'Upload Document': 'Upload Document',
    'Week': 'Week',
    'Month': 'Month',
    'Semester': 'Semester',
    'University': 'University',
    'Major': 'Major',
    'Friends': 'Friends',
    'Top Students': 'Top Students',
    'This Week': 'This Week',
    'This Month': 'This Month', 
    'This Semester': 'This Semester',
    'pts': 'pts',
    'Computer Science Major - Top Students': 'Computer Science Major - Top Students',
    'Coming soon! Major-specific leaderboards will be available in the next update.': 'Coming soon! Major-specific leaderboards will be available in the next update.',
    'Friends Circle': 'Friends Circle',
    'Add friends to see how you rank among them!': 'Add friends to see how you rank among them!',
    'Connect with Friends': 'Connect with Friends',
    'Application Language': 'Application Language',
    'Regional Settings': 'Regional Settings',
    'Additional regional settings will be available in a future update.': 'Additional regional settings will be available in a future update.',
    'Language & Region': 'Language & Region',
    'Choose your preferred language and region settings.': 'Choose your preferred language and region settings.',
    'Notifications': 'Notifications',
    'Security': 'Security',
    // Study Tools Translations
    'AI Study Tools': 'AI Study Tools',
    'Mind Maps': 'Mind Maps',
    'Flashcards': 'Flashcards', 
    'Presentations': 'Presentations',
    'ELI5 Explanations': 'ELI5 Explanations',
    'Q&A Bot': 'Q&A Bot',
    'Video Explainer': 'Video Explainer',
    'Select a Study Tool': 'Select a Study Tool',
    'Choose from our AI-powered study tools to begin learning': 'Choose from our AI-powered study tools to begin learning',
    'Select a Document': 'Select a Document',
    'Choose a document to generate a mind map from its content': 'Choose a document to generate a mind map from its content',
    'Please select a document from your library or upload a new one to create a mind map': 'Please select a document from your library or upload a new one to create a mind map',
    'You have no saved mind maps yet': 'You have no saved mind maps yet',
    'Create Mind Map': 'Create Mind Map',
    'Saved Mind Maps': 'Saved Mind Maps',
    'Create Deck': 'Create Deck',
    'Practice': 'Practice',
    'Saved Decks': 'Saved Decks',
    'Choose a document to generate flashcards from its content': 'Choose a document to generate flashcards from its content',
    'Please select a document from your library or upload a new one to create flashcards': 'Please select a document from your library or upload a new one to create flashcards',
    'You have no flashcard decks to practice yet': 'You have no flashcard decks to practice yet',
    'You have no saved flashcard decks yet': 'You have no saved flashcard decks yet',
    'Create Presentation': 'Create Presentation',
    'My Presentations': 'My Presentations',
    'Choose a document to generate a presentation from its content': 'Choose a document to generate a presentation from its content',
    'Please select a document from your library or upload a new one to create a presentation': 'Please select a document from your library or upload a new one to create a presentation',
    'You have no saved presentations yet': 'You have no saved presentations yet',
    'Create Explanation': 'Create Explanation',
    'Saved Explanations': 'Saved Explanations',
    'Choose a document to generate simplified explanations from its content': 'Choose a document to generate simplified explanations from its content',
    'Please select a document from your library or upload a new one to create ELI5 explanations': 'Please select a document from your library or upload a new one to create ELI5 explanations',
    'You have no saved explanations yet': 'You have no saved explanations yet',
    'Chat': 'Chat',
    'Documents': 'Documents',
    'AI Study Assistant': 'AI Study Assistant',
    'Ask me any questions about your documents': 'Ask me any questions about your documents',
    'Type your question...': 'Type your question...',
    'Choose a document to ask questions about its content': 'Choose a document to ask questions about its content',
    'Please select a document from your library or upload a new one to chat about': 'Please select a document from your library or upload a new one to chat about',
    'Create Video': 'Create Video',
    'My Videos': 'My Videos',
    'Choose a document to generate a video explanation from its content': 'Choose a document to generate a video explanation from its content',
    'Please select a document from your library or upload a new one to create a video explanation': 'Please select a document from your library or upload a new one to create a video explanation',
    'You have no saved videos yet': 'You have no saved videos yet',
    'Tool not found': 'Tool not found',
  },
  ar: {
    'Dashboard': 'لوحة القيادة',
    'Study Zone': 'منطقة الدراسة',
    'My Documents': 'مستنداتي',
    'Achievements': 'الإنجازات',
    'Leaderboards': 'المتصدرين',
    'Settings': 'الإعدادات',
    'Need help?': 'تحتاج مساعدة؟',
    'Check our tutorials or contact support.': 'تحقق من البرامج التعليمية لدينا أو اتصل بالدعم.',
    'View tutorials': 'عرض البرامج التعليمية',
    'Ahmed Mohammed': 'أحمد محمد',
    'Profile': 'الملف الشخصي',
    'Help & Support': 'المساعدة والدعم',
    'Log out': 'تسجيل الخروج',
    'This semester': 'هذا الفصل الدراسي',
    'Study Streak': 'تتابع الدراسة',
    'Documents Processed': 'المستندات المعالجة',
    'Points Earned': 'النقاط المكتسبة',
    'Upload New Document': 'تحميل مستند جديد',
    'Your longest streak was 12 days': 'كان أطول تتابع لك 12 يومًا',
    'You\'re in the top 10%': 'أنت في أعلى 10%',
    'Search documents...': 'البحث عن المستندات...',
    'Filter': 'تصفية',
    'pages': 'صفحات',
    'Upload Document': 'تحميل مستند',
    'Week': 'أسبوع',
    'Month': 'شهر',
    'Semester': 'فصل دراسي',
    'University': 'الجامعة',
    'Major': 'التخصص',
    'Friends': 'الأصدقاء',
    'Top Students': 'أفضل الطلاب',
    'This Week': 'هذا الأسبوع',
    'This Month': 'هذا الشهر',
    'This Semester': 'هذا الفصل الدراسي',
    'pts': 'نقاط',
    'Computer Science Major - Top Students': 'تخصص علوم الحاسب - أفضل الطلاب',
    'Coming soon! Major-specific leaderboards will be available in the next update.': 'قريبًا! ستكون لوحات المتصدرين الخاصة بالتخصص متاحة في التحديث القادم.',
    'Friends Circle': 'دائرة الأصدقاء',
    'Add friends to see how you rank among them!': 'أضف أصدقاء لترى كيف تصنف بينهم!',
    'Connect with Friends': 'تواصل مع الأصدقاء',
    'Application Language': 'لغة التطبيق',
    'Regional Settings': 'إعدادات إقليمية',
    'Additional regional settings will be available in a future update.': 'ستتوفر إعدادات إقليمية إضافية في تحديث مستقبلي.',
    'Language & Region': 'اللغة والمنطقة',
    'Choose your preferred language and region settings.': 'اختر لغتك المفضلة وإعدادات المنطقة.',
    'Notifications': 'الإشعارات',
    'Security': 'الأمان',
    // Study Tools Translations
    'AI Study Tools': 'أدوات الدراسة الذكية',
    'Mind Maps': 'خرائط ذهنية',
    'Flashcards': 'بطاقات تعليمية',
    'Presentations': 'عروض تقديمية',
    'ELI5 Explanations': 'شرح مبسط',
    'Q&A Bot': 'روبوت الأسئلة والأجوبة',
    'Video Explainer': 'شارح الفيديو',
    'Select a Study Tool': 'اختر أداة دراسة',
    'Choose from our AI-powered study tools to begin learning': 'اختر من أدوات الدراسة بالذكاء الاصطناعي لبدء التعلم',
    'Select a Document': 'اختر مستندًا',
    'Choose a document to generate a mind map from its content': 'اختر مستندًا لإنشاء خريطة ذهنية من محتواه',
    'Please select a document from your library or upload a new one to create a mind map': 'الرجاء تحديد مستند من مكتبتك أو تحميل مستند جديد لإنشاء خريطة ذهنية',
    'You have no saved mind maps yet': 'ليس لديك خرائط ذهنية محفوظة بعد',
    'Create Mind Map': 'إنشاء خريطة ذهنية',
    'Saved Mind Maps': 'الخرائط الذهنية المحفوظة',
    'Create Deck': 'إنشاء مجموعة',
    'Practice': 'تدرب',
    'Saved Decks': 'المجموعات المحفوظة',
    'Choose a document to generate flashcards from its content': 'اختر مستندًا لإنشاء بطاقات تعليمية من محتواه',
    'Please select a document from your library or upload a new one to create flashcards': 'الرجاء تحديد مستند من مكتبتك أو تحميل مستند جديد لإنشاء بطاقات تعليمية',
    'You have no flashcard decks to practice yet': 'ليس لديك مجموعات بطاقات تعليمية للتدرب عليها بعد',
    'You have no saved flashcard decks yet': 'ليس لديك مجموعات بطاقات تعليمية محفوظة بعد',
    'Create Presentation': 'إنشاء عرض تقديمي',
    'My Presentations': 'عروضي التقديمية',
    'Choose a document to generate a presentation from its content': 'اختر مستندًا لإنشاء عرض تقديمي من محتواه',
    'Please select a document from your library or upload a new one to create a presentation': 'الرجاء تحديد مستند من مكتبتك أو تحميل مستند جديد لإنشاء عرض تقديمي',
    'You have no saved presentations yet': 'ليس لديك عروض تقديمية محفوظة بعد',
    'Create Explanation': 'إنشاء شرح',
    'Saved Explanations': 'الشروحات المحفوظة',
    'Choose a document to generate simplified explanations from its content': 'اختر مستندًا لإنشاء شروحات مبسطة من محتواه',
    'Please select a document from your library or upload a new one to create ELI5 explanations': 'الرجاء تحديد مستند من مكتبتك أو تحميل مستند جديد لإنشاء شروحات مبسطة',
    'You have no saved explanations yet': 'ليس لديك شروحات محفوظة بعد',
    'Chat': 'محادثة',
    'Documents': 'المستندات',
    'AI Study Assistant': 'مساعد الدراسة الذكي',
    'Ask me any questions about your documents': 'اسألني أي أسئلة حول مستنداتك',
    'Type your question...': 'اكتب سؤالك...',
    'Choose a document to ask questions about its content': 'اختر مستندًا لطرح أسئلة حول محتواه',
    'Please select a document from your library or upload a new one to chat about': 'الرجاء تحديد مستند من مكتبتك أو تحميل مستند جديد للتحدث عنه',
    'Create Video': 'إنشاء فيديو',
    'My Videos': 'مقاطع الفيديو الخاصة بي',
    'Choose a document to generate a video explanation from its content': 'اختر مستندًا لإنشاء شرح فيديو من محتواه',
    'Please select a document from your library or upload a new one to create a video explanation': 'الرجاء تحديد مستند من مكتبتك أو تحميل مستند جديد لإنشاء شرح فيديو',
    'You have no saved videos yet': 'ليس لديك مقاطع فيديو محفوظة بعد',
    'Tool not found': 'الأداة غير موجودة',
  }
};

// Context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if there's a stored language preference
  const savedLanguage = localStorage.getItem('language') as Language;
  const [language, setLanguage] = useState<Language>(savedLanguage || 'en');
  const [dir, setDir] = useState<'ltr' | 'rtl'>(language === 'ar' ? 'rtl' : 'ltr');

  // Translate function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  // Update document direction when language changes and save preference
  useEffect(() => {
    const newDir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = newDir;
    localStorage.setItem('language', language);
    setDir(newDir);
    
    // Add RTL class to body if Arabic
    if (language === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
