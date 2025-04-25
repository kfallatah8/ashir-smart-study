
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Plus, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const Documents = () => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  
  // Sample document data
  const documents = [
    {
      id: 1,
      title: 'Calculus Notes',
      pages: 14,
      date: '2023-10-25',
      type: 'PDF'
    },
    {
      id: 2,
      title: 'Physics Lab Report',
      pages: 8,
      date: '2023-10-20',
      type: 'DOCX'
    },
    {
      id: 3,
      title: 'Computer Science Lecture',
      pages: 22,
      date: '2023-10-15',
      type: 'PDF'
    },
    {
      id: 4,
      title: 'Arabic Literature Notes',
      pages: 18,
      date: '2023-10-10',
      type: 'PDF'
    },
  ];

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className={cn(
          "flex justify-between items-center mb-6",
          isRTL && "flex-row-reverse"
        )}>
          <h1 className="text-2xl font-bold">{t('My Documents')}</h1>
          <Button className={cn(
            "flex items-center",
            isRTL && "flex-row-reverse"
          )}>
            <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
            <span>{language === 'en' ? 'Upload Document' : 'تحميل مستند'}</span>
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className={cn(
              "flex items-center gap-4 mb-6",
              isRTL && "flex-row-reverse"
            )}>
              <div className="relative flex-1">
                <Search className={cn(
                  "absolute top-3 text-gray-400 h-4 w-4",
                  isRTL ? "right-3" : "left-3"
                )} />
                <Input 
                  className={cn(
                    "pl-10 pr-4",
                    isRTL && "pl-4 pr-10"
                  )}
                  placeholder={language === 'en' ? "Search documents..." : "البحث عن المستندات..."} 
                />
              </div>
              <Button variant="outline" className={cn(
                "flex items-center",
                isRTL && "flex-row-reverse"
              )}>
                <Filter className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                <span>{language === 'en' ? 'Filter' : 'تصفية'}</span>
              </Button>
            </div>

            <div className="grid gap-4">
              {documents.map((doc) => (
                <div 
                  key={doc.id}
                  className={cn(
                    "flex items-center border rounded-lg p-4 hover:bg-gray-50 cursor-pointer",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  <div className={cn(
                    "bg-primary-100 p-3 rounded-lg",
                    isRTL ? "ml-4" : "mr-4"
                  )}>
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className={cn("flex-1", isRTL && "text-right")}>
                    <h3 className="font-medium">{doc.title}</h3>
                    <p className="text-sm text-gray-500">
                      {language === 'en' ? `${doc.pages} pages` : `${doc.pages} صفحات`} • {doc.type}
                    </p>
                  </div>
                  
                  <div className={cn(
                    "text-right",
                    isRTL && "text-left"
                  )}>
                    <p className="text-sm text-gray-500">
                      {new Date(doc.date).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA')}
                    </p>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Documents;
