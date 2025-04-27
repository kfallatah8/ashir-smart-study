
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function WelcomeCard() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get additional user profile data if available
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();
            
          if (profile?.full_name) {
            setUserName(profile.full_name.split(' ')[0]);
          } else {
            // Use email as fallback if no name found
            setUserName(user.email?.split('@')[0] || 'Student');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserName('Student');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserProfile();
  }, []);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return language === 'en' ? 'Good morning' : 'صباح الخير';
    if (hour < 18) return language === 'en' ? 'Good afternoon' : 'مساء الخير';
    return language === 'en' ? 'Good evening' : 'مساء الخير';
  };

  return (
    <Card className="bg-gradient-to-r from-primary to-secondary text-white transform-3d hover:element-3d">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-primary-100">{getGreeting()}</p>
            <h2 className="text-2xl font-bold mt-1">
              {loading ? 
                <span className="inline-block w-32 h-8 bg-white/20 animate-pulse rounded"></span> :
                (language === 'en' ? 
                  <>Welcome back, {userName}!</> : 
                  <>مرحبًا بعودتك، {userName}!</>)
              }
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
          <button 
            onClick={() => document.getElementById('file-upload')?.click()} 
            className="px-4 py-2 bg-white text-primary font-medium rounded-lg hover:bg-primary-100 transition-colors transform-3d hover:element-3d"
          >
            {t('Upload Document')}
          </button>
          <button 
            onClick={() => navigate('/study')}
            className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors transform-3d hover:element-3d"
          >
            {t('Study Now')}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
