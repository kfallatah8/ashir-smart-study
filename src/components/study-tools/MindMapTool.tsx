
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocumentSelector, { Document } from './DocumentSelector';
import { useAITools } from '@/hooks/use-ai-tools';
import { useToast } from "@/hooks/use-toast";
import AIToolResults from './AIToolResults';

const MindMapTool = () => {
  const { t } = useLanguage();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { isProcessing, generateTool, tasks, isLoading } = useAITools(selectedDocument?.id || '');
  const { toast } = useToast();

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleGenerateMindMap = async () => {
    if (!selectedDocument) {
      toast({
        title: t('Error'),
        description: t('Please select a document first'),
        variant: "destructive"
      });
      return;
    }

    try {
      await generateTool('mind_map');
      toast({
        title: t('Success'),
        description: t('Your mind map is being generated'),
      });
    } catch (error) {
      console.error('Error generating mind map:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            {t('Mind Maps')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">{t('Create Mind Map')}</TabsTrigger>
              <TabsTrigger value="saved">{t('Saved Mind Maps')}</TabsTrigger>
            </TabsList>
            <TabsContent value="create" className="space-y-4 mt-4">
              {selectedDocument ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">{t('Selected Document')}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedDocument(null)}
                    >
                      {t('Change')}
                    </Button>
                  </div>
                  <Card className="mb-4 bg-accent-50 border-accent-200">
                    <CardContent className="p-4 flex items-center">
                      <div className="bg-accent-100 p-2 rounded-lg mr-3">
                        <BookOpen className="h-5 w-5 text-accent-700" />
                      </div>
                      <div>
                        <h3 className="font-medium line-clamp-1">{selectedDocument.title}</h3>
                        <p className="text-xs text-gray-500">
                          {selectedDocument.file_type.split('/')[1]?.toUpperCase() || selectedDocument.file_type}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleGenerateMindMap}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className="mr-2">{t('Generating...')}</span>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </>
                    ) : (
                      t('Generate Mind Map')
                    )}
                  </Button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('Select a Document')}</h3>
                  <DocumentSelector 
                    onSelect={handleDocumentSelect}
                  />
                </div>
              )}
            </TabsContent>
            <TabsContent value="saved">
              <AIToolResults 
                tasks={tasks} 
                isLoading={isLoading} 
                toolType="mind_map" 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MindMapTool;
