
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

const studyTools = [
  {
    id: 1,
    title: "Mind Maps",
    titleAr: "خرائط ذهنية",
    description: "Visual learning aids",
    descriptionAr: "وسائل تعلم مرئية",
    icon: "🧠",
    color: "bg-accent-100",
    activeColor: "bg-accent-200",
    shadowColor: "shadow-accent-200/30",
    path: "/study/mind-maps",
    isAvailable: true,
    isNew: false
  },
  {
    id: 2,
    title: "Flashcards",
    titleAr: "بطاقات تعليمية",
    description: "Memory reinforcement",
    descriptionAr: "تعزيز الذاكرة",
    icon: "🃏",
    color: "bg-primary-100",
    activeColor: "bg-primary-200",
    shadowColor: "shadow-primary-200/40",
    path: "/study/flashcards",
    isAvailable: true,
    isNew: true
  },
  {
    id: 3,
    title: "Presentations",
    titleAr: "عروض تقديمية",
    description: "Summarized content",
    descriptionAr: "محتوى ملخص",
    icon: "📊",
    color: "bg-secondary-100",
    activeColor: "bg-secondary-200",
    shadowColor: "shadow-secondary-200/30",
    path: "/study/presentations",
    isAvailable: true,
    isNew: false
  },
  {
    id: 4,
    title: "ELI5 Explanations",
    titleAr: "شرح مبسط",
    description: "Simplified concepts",
    descriptionAr: "مفاهيم مبسطة",
    icon: "👶",
    color: "bg-green-100",
    activeColor: "bg-green-200",
    shadowColor: "shadow-green-200/30",
    path: "/study/eli5",
    isAvailable: true,
    isNew: false
  },
  {
    id: 5,
    title: "Q&A Bot",
    titleAr: "روبوت الأسئلة والأجوبة",
    description: "Interactive learning",
    descriptionAr: "تعلم تفاعلي",
    icon: "🤖",
    color: "bg-yellow-100",
    activeColor: "bg-yellow-200",
    shadowColor: "shadow-yellow-200/30",
    path: "/study/qa-bot",
    isAvailable: true,
    isNew: false
  },
  {
    id: 6,
    title: "Video Explainer",
    titleAr: "شارح الفيديو",
    description: "Visual tutorials",
    descriptionAr: "دروس مرئية",
    icon: "🎬",
    color: "bg-red-100",
    activeColor: "bg-red-200",
    shadowColor: "shadow-red-200/30", 
    path: "/study/video",
    isAvailable: false,
    isNew: true,
    comingSoon: true
  }
];

export default function StudyToolsCard() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [activeToolId, setActiveToolId] = useState<number | null>(null);

  const handleToolClick = (tool: typeof studyTools[0]) => {
    if (!tool.isAvailable) {
      toast({
        title: language === 'en' ? 'Coming Soon' : 'قريباً',
        description: language === 'en' 
          ? `${tool.title} is coming soon. Stay tuned!` 
          : `${tool.titleAr} قادم قريباً. ترقبوا المزيد!`,
      });
      return;
    }
    
    setActiveToolId(tool.id);
    
    // Add a slight delay for the animation effect
    setTimeout(() => {
      navigate(tool.path);
      toast({
        title: language === 'en' ? `Opening ${tool.title}` : `فتح ${tool.titleAr}`,
        description: language === 'en' ? `Launching ${tool.title} tool` : `جاري تشغيل أداة ${tool.titleAr}`,
      });
    }, 300);
  };

  return (
    <Card className="h-full transform-3d hover:element-3d">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          {t('AI Study Tools')}
          <Badge variant="outline" className="bg-primary-50 text-primary text-xs">
            {t('Powered by AI')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {studyTools.map((tool) => (
            <TooltipProvider key={tool.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={`p-3 rounded-lg transition-all transform-3d ${
                      activeToolId === tool.id 
                        ? 'scale-95' 
                        : 'hover:scale-105'
                    } ${
                      tool.isAvailable 
                        ? 'cursor-pointer' 
                        : 'opacity-70 cursor-default'
                    } ${
                      activeToolId === tool.id 
                        ? `${tool.activeColor} ${tool.shadowColor} shadow-lg` 
                        : `hover:${tool.color} hover:shadow-md ${tool.shadowColor}`
                    }`}
                    onClick={() => handleToolClick(tool)}
                  >
                    <div className={`relative w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center text-2xl transition-transform ${
                      activeToolId === tool.id 
                        ? 'transform -translate-y-1 scale-105' 
                        : 'hover:scale-105'
                    }`}>
                      {tool.icon}
                      {tool.isNew && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse border border-white"></span>
                      )}
                    </div>
                    <h4 className="mt-2 text-sm font-medium">
                      {language === 'en' ? tool.title : tool.titleAr}
                      {tool.comingSoon && (
                        <span className="ml-1 text-xs text-gray-500">
                          ({language === 'en' ? 'Coming Soon' : 'قريباً'})
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-500">{language === 'en' ? tool.description : tool.descriptionAr}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {tool.isAvailable 
                    ? t('Click to open') 
                    : t('Coming soon')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
