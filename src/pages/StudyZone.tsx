
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/hooks/use-language';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookText, File } from 'lucide-react';

// Import study tool components (we'll create placeholders for now)
import MindMapTool from '@/components/study-tools/MindMapTool';
import FlashcardsTool from '@/components/study-tools/FlashcardsTool';
import PresentationsTool from '@/components/study-tools/PresentationsTool';
import ELI5Tool from '@/components/study-tools/ELI5Tool';
import QABotTool from '@/components/study-tools/QABotTool';
import VideoTool from '@/components/study-tools/VideoTool';

const StudyZone = () => {
  const { tool } = useParams();
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  // Function to render the correct study tool based on route parameter
  const renderStudyTool = () => {
    if (!tool) {
      return (
        <div className="text-center py-10">
          <div className="mb-6">
            <BookText className="h-12 w-12 mx-auto text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">{t('Select a Study Tool')}</h2>
          <p className="text-gray-500 mb-6">{t('Choose from our AI-powered study tools to begin learning')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Button 
              variant="outline" 
              className="py-6 flex flex-col items-center" 
              onClick={() => window.location.href = '/study/mind-maps'}
            >
              <span className="text-2xl mb-2">🧠</span>
              <span>{t('Mind Maps')}</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="py-6 flex flex-col items-center" 
              onClick={() => window.location.href = '/study/flashcards'}
            >
              <span className="text-2xl mb-2">🃏</span>
              <span>{t('Flashcards')}</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="py-6 flex flex-col items-center" 
              onClick={() => window.location.href = '/study/presentations'}
            >
              <span className="text-2xl mb-2">📊</span>
              <span>{t('Presentations')}</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="py-6 flex flex-col items-center" 
              onClick={() => window.location.href = '/study/eli5'}
            >
              <span className="text-2xl mb-2">👶</span>
              <span>{t('ELI5 Explanations')}</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="py-6 flex flex-col items-center" 
              onClick={() => window.location.href = '/study/qa-bot'}
            >
              <span className="text-2xl mb-2">🤖</span>
              <span>{t('Q&A Bot')}</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="py-6 flex flex-col items-center" 
              onClick={() => window.location.href = '/study/video'}
            >
              <span className="text-2xl mb-2">🎬</span>
              <span>{t('Video Explainer')}</span>
            </Button>
          </div>
        </div>
      );
    }

    // Render the appropriate tool based on the URL parameter
    switch (tool) {
      case 'mind-maps':
        return <MindMapTool />;
      case 'flashcards':
        return <FlashcardsTool />;
      case 'presentations':
        return <PresentationsTool />;
      case 'eli5':
        return <ELI5Tool />;
      case 'qa-bot':
        return <QABotTool />;
      case 'video':
        return <VideoTool />;
      default:
        return <div>{t('Tool not found')}</div>;
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">{t('Study Zone')}</h1>
        {renderStudyTool()}
      </div>
    </MainLayout>
  );
};

export default StudyZone;
