
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { useNavigate } from 'react-router-dom';

export default function WelcomeCard() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === 'en' ? 'Good morning' : 'صباح الخير';
    if (hour < 18) return language === 'en' ? 'Good afternoon' : 'مساء الخير';
    return language === 'en' ? 'Good evening' : 'مساء الخير';
  };

  return (
    <Card className="bg-gradient-to-r from-primary to-secondary text-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-primary-100">{getGreeting()}</p>
            <h2 className="text-2xl font-bold mt-1">
              {language === 'en' ? 'Welcome back, Ahmed!' : 'مرحبًا بعودتك، أحمد!'}
            </h2>
            <p className="mt-2 text-primary-100">
              {language === 'en' ? (
                <>You have <span className="font-bold text-white">3 subjects</span> to study today and an exam in <span className="font-bold text-white">5 days</span>.</>
              ) : (
                <>لديك <span className="font-bold text-white">3 مواد</span> للدراسة اليوم وامتحان خلال <span className="font-bold text-white">5 أيام</span>.</>
              )}
            </p>
          </div>
          <div className="w-24 h-24 flex items-center justify-center">
            <img src="/placeholder.svg" alt={language === 'en' ? "Study" : "دراسة"} className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="mt-4 flex space-x-3">
          <button className="px-4 py-2 bg-white text-primary font-medium rounded-lg hover:bg-primary-100 transition-colors">
            {t('Upload Document')}
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
            {t('Study Now')}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
