
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
  const [language, setLanguage] = useState<Language>('en');
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  // Translate function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  // Update document direction when language changes
  useEffect(() => {
    const newDir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = newDir;
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
