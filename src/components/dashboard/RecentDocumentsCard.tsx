
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { File3d, FileText, Image } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

const recentDocuments = [
  {
    id: 1,
    title: 'Organic Chemistry Notes',
    type: 'PDF',
    date: '3 hours ago',
    progress: 75,
    icon: <FileText className="h-4 w-4 text-blue-700" />
  },
  {
    id: 2,
    title: 'Calculus II - Week 5',
    type: 'Word',
    date: 'Yesterday',
    progress: 40,
    icon: <File3d className="h-4 w-4 text-blue-700" />
  },
  {
    id: 3,
    title: 'Computer Science Fundamentals',
    type: 'Image',
    date: '2 days ago',
    progress: 90,
    icon: <Image className="h-4 w-4 text-blue-700" />
  }
];

export default function RecentDocumentsCard() {
  const { t } = useLanguage();
  
  return (
    <Card className="h-full transform-3d hover:element-3d">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">{t('Recent Documents')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-medium">
                {doc.icon}
              </div>
              <div className="ml-3 flex-1">
                <h4 className="text-sm font-medium">{t(doc.title)}</h4>
                <p className="text-xs text-gray-500">{t(doc.date)}</p>
              </div>
              <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${doc.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="mt-4 text-sm text-primary hover:text-primary-600 font-medium w-full text-center">
          {t('View all documents')} →
        </button>
      </CardContent>
    </Card>
  );
}
