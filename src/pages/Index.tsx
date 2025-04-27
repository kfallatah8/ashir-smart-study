
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentDocumentsCard from '@/components/dashboard/RecentDocumentsCard';
import StudyToolsCard from '@/components/dashboard/StudyToolsCard';
import UploadZone from '@/components/upload/UploadZone';
import { Award, Check, BookOpen } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

const Index = () => {
  const { t } = useLanguage();
  
  return (
    <MainLayout>
      <div className="animate-fade-in max-w-7xl mx-auto">
        <div className="mb-8">
          <WelcomeCard />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Study Streak" 
            value="7 Days" 
            description="Your longest streak was 12 days" 
            progress={58}
            icon={<Check className="h-5 w-5 text-green-500" />}
            color="bg-green-100"
          />
          <StatsCard 
            title="Documents Processed" 
            value="24" 
            description="This semester" 
            progress={80}
            icon={<BookOpen className="h-5 w-5 text-accent-500" />}
            color="bg-accent-100"
          />
          <StatsCard 
            title="Points Earned" 
            value="1,250" 
            description="You're in the top 10%" 
            progress={65}
            icon={<Award className="h-5 w-5 text-primary" />}
            color="bg-primary-100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <RecentDocumentsCard />
            
            {/* Only one upload section */}
            <div className="bg-white p-6 rounded-xl shadow-sm transform-3d hover:element-3d">
              <h2 className="text-xl font-bold mb-4">{t('Upload New Document')}</h2>
              <UploadZone />
            </div>
          </div>
          
          <div>
            <StudyToolsCard />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
