
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';

const studyTools = [
  {
    id: 1,
    title: "Mind Maps",
    titleAr: "خرائط ذهنية",
    description: "Visual learning aids",
    descriptionAr: "وسائل تعلم مرئية",
    icon: "🧠",
    color: "bg-accent-100",
    path: "/study/mind-maps"
  },
  {
    id: 2,
    title: "Flashcards",
    titleAr: "بطاقات تعليمية",
    description: "Memory reinforcement",
    descriptionAr: "تعزيز الذاكرة",
    icon: "🃏",
    color: "bg-primary-100",
    path: "/study/flashcards"
  },
  {
    id: 3,
    title: "Presentations",
    titleAr: "عروض تقديمية",
    description: "Summarized content",
    descriptionAr: "محتوى ملخص",
    icon: "📊",
    color: "bg-secondary-100",
    path: "/study/presentations"
  },
  {
    id: 4,
    title: "ELI5 Explanations",
    titleAr: "شرح مبسط",
    description: "Simplified concepts",
    descriptionAr: "مفاهيم مبسطة",
    icon: "👶",
    color: "bg-green-100",
    path: "/study/eli5"
  },
  {
    id: 5,
    title: "Q&A Bot",
    titleAr: "روبوت الأسئلة والأجوبة",
    description: "Interactive learning",
    descriptionAr: "تعلم تفاعلي",
    icon: "🤖",
    color: "bg-yellow-100",
    path: "/study/qa-bot"
  },
  {
    id: 6,
    title: "Video Explainer",
    titleAr: "شارح الفيديو",
    description: "Visual tutorials",
    descriptionAr: "دروس مرئية",
    icon: "🎬",
    color: "bg-red-100",
    path: "/study/video"
  }
];

export default function StudyToolsCard() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { toast } = useToast();

  const handleToolClick = (tool: typeof studyTools[0]) => {
    navigate(tool.path);
    toast({
      title: language === 'en' ? `Opening ${tool.title}` : `فتح ${tool.titleAr}`,
      description: language === 'en' ? `Launching ${tool.title} tool` : `جاري تشغيل أداة ${tool.titleAr}`,
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">{t('AI Study Tools')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {studyTools.map((tool) => (
            <div 
              key={tool.id} 
              className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all hover:scale-105"
              onClick={() => handleToolClick(tool)}
            >
              <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center text-2xl`}>
                {tool.icon}
              </div>
              <h4 className="mt-2 text-sm font-medium">{language === 'en' ? tool.title : tool.titleAr}</h4>
              <p className="text-xs text-gray-500">{language === 'en' ? tool.description : tool.descriptionAr}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
