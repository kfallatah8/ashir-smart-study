import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import DocumentSelector, { Document } from './DocumentSelector';
import { useToast } from '@/hooks/use-toast';
import { useAITools } from '@/hooks/use-ai-tools';

export default function ELI5Tool() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isProcessing, generateTool, tasks } = useAITools(selectedDocument?.id || '');
  
  const completedTask = tasks.find(
    task => task.tool_type === 'eli5' && task.status === 'completed'
  );
  const explanation = completedTask?.result?.explanation;

  const handleGenerate = async () => {
    if (!selectedDocument) {
      toast({
        title: t('No Document Selected'),
        description: t('Please select a document first'),
        variant: 'destructive'
      });
      return;
    }
    
    await generateTool('eli5');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5" />
            {t('Explain Like I\'m 5')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DocumentSelector
            onSelect={setSelectedDocument}
            selectedDocumentId={selectedDocument?.id}
          />
          
          <Button 
            onClick={handleGenerate}
            className="w-full"
            disabled={!selectedDocument || isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="mr-2 h-4 w-4" />
            )}
            {isProcessing ? t('Generating...') : t('Generate Simple Explanation')}
          </Button>

          {explanation && (
            <Card className="mt-4 bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="pt-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">{explanation}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
