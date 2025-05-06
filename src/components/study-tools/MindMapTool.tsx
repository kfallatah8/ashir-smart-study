
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DocumentSelector, { Document } from './DocumentSelector';
import { useAITools } from '@/hooks/use-ai-tools';
import { useToast } from "@/hooks/use-toast";
import { AIToolTask } from '@/lib/document-utils';

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

  const renderTasksList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!tasks || tasks.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">
            {t('You have no saved mind maps yet')}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {tasks.map((task: AIToolTask) => (
          <Card key={task.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Mind Map #{task.id.substring(0, 8)}</h3>
                <div className="flex items-center">
                  {task.status === 'completed' ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">{t('Completed')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-amber-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-xs">{t('Processing')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {task.status === 'completed' && task.result && (
                <div className="mt-4 border rounded p-4 bg-gray-50">
                  <pre className="whitespace-pre-wrap text-sm">
                    {typeof task.result === 'object' 
                      ? JSON.stringify(task.result, null, 2) 
                      : task.result}
                  </pre>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                {new Date(task.created_at).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
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
              {renderTasksList()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MindMapTool;
