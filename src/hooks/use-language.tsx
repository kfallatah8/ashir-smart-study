
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    'Dashboard': 'Dashboard',
    'Study Zone': 'Study Zone',
    'My Documents': 'My Documents',
    'Achievements': 'Achievements',
    'Leaderboards': 'Leaderboards',
    'Settings': 'Settings',
    'Welcome back': 'Welcome back',
    'Total Documents': 'Total Documents',
    'Study Hours': 'Study Hours',
    'Points Earned': 'Points Earned',
    'Recent Documents': 'Recent Documents',
    'View All': 'View All',
    'Uploaded Date': 'Uploaded Date',
    'File Size': 'File Size',
    'Study Tools': 'Study Tools',
    'AI Summarizer': 'AI Summarizer',
    'Grammar Checker': 'Grammar Checker',
    'Citation Generator': 'Citation Generator',
    'Summarize complex topics': 'Summarize complex topics',
    'Improve your writing': 'Improve your writing',
    'Generate citations quickly': 'Generate citations quickly',
    'Summarize': 'Summarize',
    'Check Grammar': 'Check Grammar',
    'Generate Citation': 'Generate Citation',
    'Upload New Document': 'Upload New Document',
    
    // Study Tools
    'AI Study Tools': 'AI Study Tools',
    'Mind Maps': 'Mind Maps',
    'Flashcards': 'Flashcards',
    'Presentations': 'Presentations',
    'ELI5 Explanations': 'ELI5 Explanations',
    'Q&A Bot': 'Q&A Bot',
    'Video Summaries': 'Video Summaries',
    'Create Mind Map': 'Create Mind Map',
    'Practice with Flashcards': 'Practice with Flashcards',
    'Generate Presentation': 'Generate Presentation',
    'Simplified Explanations': 'Simplified Explanations',
    'Ask Questions': 'Ask Questions',
    'Watch Video Summary': 'Watch Video Summary',
    
    // Profile
    'Ahmed Mohammed': 'Ahmed Mohammed',
    'Computer Science Major': 'Computer Science Major',
    '3rd Year Student': '3rd Year Student',
    'Edit Profile': 'Edit Profile',
    'Learning Stats': 'Learning Stats',
    'Documents Processed': 'Documents Processed',
    'Current Streak': 'Current Streak',
    'Days': 'Days',
    'Documents': 'Documents',
    'Courses': 'Courses',
    'Recent Achievements': 'Recent Achievements',
    'Learning Path': 'Learning Path',
    'Enrolled Courses': 'Enrolled Courses',
    'View': 'View',
    'Course': 'Course',
    'Progress': 'Progress',
    'Earned': 'Earned',
    'days ago': 'days ago',
    'Achievement': 'Achievement',
    'Milestone': 'Milestone',
    'Complete': 'Complete',
    'study sessions': 'study sessions',
    
    // Upload
    'Upload your documents': 'Upload your documents',
    'Drag and drop your files here, or click to browse': 'Drag and drop your files here, or click to browse',
    'Supports PDFs, Word documents, images, and handwritten notes': 'Supports PDFs, Word documents, images, and handwritten notes',
    'Browse Files': 'Browse Files',
    'Uploading document...': 'Uploading document...',
    'This will just take a moment': 'This will just take a moment',
    'Upload Complete!': 'Upload Complete!',
    'Your document is ready for processing': 'Your document is ready for processing',
    'Upload Complete': 'Upload Complete',
    'Your files have been successfully uploaded': 'Your files have been successfully uploaded',
    
    // Q&A
    'AI Study Assistant': 'AI Study Assistant',
    'Ask me any questions about your documents': 'Ask me any questions about your documents',
    'Type your question...': 'Type your question...',
    'Select a Document': 'Select a Document',
    'Choose a document to ask questions about its content': 'Choose a document to ask questions about its content',
    'Please select a document from your library or upload a new one to chat about': 'Please select a document from your library or upload a new one to chat about',
    'You have no saved videos yet': 'You have no saved videos yet',
    'You have no saved mind maps yet': 'You have no saved mind maps yet',
    'You have no saved explanations yet': 'You have no saved explanations yet',
    'You have no saved presentations yet': 'You have no saved presentations yet',
    'You have no flashcard decks to practice yet': 'You have no flashcard decks to practice yet',
    'You have no saved flashcard decks yet': 'You have no saved flashcard decks yet',
    'Need help?': 'Need help?',
    'Check our tutorials or contact support.': 'Check our tutorials or contact support.',
    'View tutorials': 'View tutorials',
  },
  ar: {
    'Dashboard': 'لوحة التحكم',
    'Study Zone': 'منطقة الدراسة',
    'My Documents': 'مستنداتي',
    'Achievements': 'الإنجازات',
    'Leaderboards': 'المتصدرون',
    'Settings': 'الإعدادات',
    'Welcome back': 'مرحباً بعودتك',
    'Total Documents': 'إجمالي المستندات',
    'Study Hours': 'ساعات الدراسة',
    'Points Earned': 'النقاط المكتسبة',
    'Recent Documents': 'المستندات الأخيرة',
    'View All': 'عرض الكل',
    'Uploaded Date': 'تاريخ الرفع',
    'File Size': 'حجم الملف',
    'Study Tools': 'أدوات الدراسة',
    'AI Summarizer': 'ملخص الذكاء الاصطناعي',
    'Grammar Checker': 'مدقق القواعد',
    'Citation Generator': 'مولد الاقتباسات',
    'Summarize complex topics': 'تلخيص المواضيع المعقدة',
    'Improve your writing': 'تحسين كتابتك',
    'Generate citations quickly': 'إنشاء اقتباسات بسرعة',
    'Summarize': 'لخص',
    'Check Grammar': 'فحص القواعد',
    'Generate Citation': 'إنشاء اقتباس',
    'Upload New Document': 'رفع مستند جديد',
    
    // Study Tools
    'AI Study Tools': 'أدوات الدراسة الذكية',
    'Mind Maps': 'خرائط ذهنية',
    'Flashcards': 'بطاقات تعليمية',
    'Presentations': 'عروض تقديمية',
    'ELI5 Explanations': 'شرح مبسط',
    'Q&A Bot': 'روبوت الأسئلة والأجوبة',
    'Video Summaries': 'ملخصات الفيديو',
    'Create Mind Map': 'إنشاء خريطة ذهنية',
    'Practice with Flashcards': 'التدرب باستخدام البطاقات',
    'Generate Presentation': 'إنشاء عرض تقديمي',
    'Simplified Explanations': 'شروحات مبسطة',
    'Ask Questions': 'اطرح الأسئلة',
    'Watch Video Summary': 'شاهد ملخص الفيديو',
    
    // Profile
    'Ahmed Mohammed': 'أحمد محمد',
    'Computer Science Major': 'تخصص علوم الحاسب',
    '3rd Year Student': 'طالب السنة الثالثة',
    'Edit Profile': 'تعديل الملف الشخصي',
    'Learning Stats': 'إحصائيات التعلم',
    'Documents Processed': 'المستندات المعالجة',
    'Current Streak': 'التتابع الحالي',
    'Days': 'أيام',
    'Documents': 'المستندات',
    'Courses': 'الدورات',
    'Recent Achievements': 'الإنجازات الأخيرة',
    'Learning Path': 'مسار التعلم',
    'Enrolled Courses': 'الدورات المسجلة',
    'View': 'عرض',
    'Course': 'دورة',
    'Progress': 'التقدم',
    'Achievement': 'إنجاز',
    'Milestone': 'معلم',
    'Complete': 'إكمال',
    'study sessions': 'جلسات دراسية',
    'Earned': 'اكتسب',
    'days ago': 'أيام مضت',
    
    // Upload
    'Upload your documents': 'تحميل مستنداتك',
    'Drag and drop your files here, or click to browse': 'اسحب وأفلت ملفاتك هنا، أو انقر للتصفح',
    'Supports PDFs, Word documents, images, and handwritten notes': 'يدعم ملفات PDF ومستندات Word والصور والملاحظات المكتوبة بخط اليد',
    'Browse Files': 'تصفح الملفات',
    'Uploading document...': 'جاري تحميل المستند...',
    'This will just take a moment': 'سيستغرق هذا لحظة فقط',
    'Upload Complete!': 'اكتمل التحميل!',
    'Your document is ready for processing': 'مستندك جاهز للمعالجة',
    'Upload Complete': 'اكتمل التحميل',
    'Your files have been successfully uploaded': 'تم تحميل ملفاتك بنجاح',
    
    // Q&A
    'AI Study Assistant': 'مساعد الدراسة الذكي',
    'Ask me any questions about your documents': 'اسألني أي سؤال عن مستنداتك',
    'Type your question...': 'اكتب سؤالك...',
    'Select a Document': 'اختر مستندًا',
    'Choose a document to ask questions about its content': 'اختر مستندًا لطرح أسئلة حول محتواه',
    'Please select a document from your library or upload a new one to chat about': 'يرجى اختيار مستند من مكتبتك أو تحميل مستند جديد للدردشة حوله',
    'You have no saved videos yet': 'ليس لديك مقاطع فيديو محفوظة بعد',
    'You have no saved mind maps yet': 'ليس لديك خرائط ذهنية محفوظة بعد',
    'You have no saved explanations yet': 'ليس لديك شروحات محفوظة بعد',
    'You have no saved presentations yet': 'ليس لديك عروض تقديمية محفوظة بعد',
    'You have no flashcard decks to practice yet': 'ليس لديك مجموعات بطاقات للتدرب عليها بعد',
    'You have no saved flashcard decks yet': 'ليس لديك مجموعات بطاقات محفوظة بعد',
    'Need help?': 'بحاجة إلى مساعدة؟',
    'Check our tutorials or contact support.': 'راجع دروسنا التعليمية أو اتصل بالدعم.',
    'View tutorials': 'عرض الدروس التعليمية',
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>((localStorage.getItem('language') as Language) || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const value: LanguageContextProps = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
