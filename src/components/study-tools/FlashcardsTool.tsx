
import React from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from 'lucide-react';

const FlashcardsTool = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-2xl">🃏</span>
            {t('Flashcards')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="create">{t('Create Deck')}</TabsTrigger>
              <TabsTrigger value="practice">{t('Practice')}</TabsTrigger>
              <TabsTrigger value="saved">{t('Saved Decks')}</TabsTrigger>
            </TabsList>
            <TabsContent value="create" className="space-y-4 mt-4">
              <div className="text-center py-10">
                <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('Select a Document')}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {t('Choose a document to generate flashcards from its content')}
                </p>
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-primary-700 text-sm">
                    {t('Please select a document from your library or upload a new one to create flashcards')}
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="practice">
              <div className="text-center py-10">
                <p className="text-gray-500">
                  {t('You have no flashcard decks to practice yet')}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="saved">
              <div className="text-center py-10">
                <p className="text-gray-500">
                  {t('You have no saved flashcard decks yet')}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlashcardsTool;
