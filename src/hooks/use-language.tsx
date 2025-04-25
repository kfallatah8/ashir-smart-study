
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
