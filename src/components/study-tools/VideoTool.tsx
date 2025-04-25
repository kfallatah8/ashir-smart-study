
import React from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from 'lucide-react';

const VideoTool = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            {t('Video Explainer')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">{t('Create Video')}</TabsTrigger>
              <TabsTrigger value="saved">{t('My Videos')}</TabsTrigger>
            </TabsList>
            <TabsContent value="create" className="space-y-4 mt-4">
              <div className="text-center py-10">
                <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('Select a Document')}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {t('Choose a document to generate a video explanation from its content')}
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-700 text-sm">
                    {t('Please select a document from your library or upload a new one to create a video explanation')}
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="saved">
              <div className="text-center py-10">
                <p className="text-gray-500">
                  {t('You have no saved videos yet')}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoTool;
