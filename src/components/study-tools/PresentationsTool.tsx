import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Presentation, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import DocumentSelector, { Document } from './DocumentSelector';
import { useToast } from '@/hooks/use-toast';
import { useAITools } from '@/hooks/use-ai-tools';

export default function PresentationsTool() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isProcessing, generateTool, tasks } = useAITools(selectedDocument?.id || '');
  
  const completedTask = tasks.find(
    task => task.tool_type === 'presentations' && task.status === 'completed'
  );
  const slides = completedTask?.result?.slides || [];

  const handleGenerate = async () => {
    if (!selectedDocument) {
      toast({
        title: t('No Document Selected'),
        description: t('Please select a document first'),
        variant: 'destructive'
      });
      return;
    }
    
    await generateTool('presentations');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Presentation className="mr-2 h-5 w-5" />
            {t('Generate Presentations')}
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
              <Presentation className="mr-2 h-4 w-4" />
            )}
            {isProcessing ? t('Generating...') : t('Generate Presentation')}
          </Button>
        </CardContent>
      </Card>

      {slides.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {t('Slide')} {currentSlide + 1} / {slides.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-lg min-h-[300px]">
              <h2 className="text-2xl font-bold mb-4">{slides[currentSlide]?.title}</h2>
              <div className="text-lg whitespace-pre-wrap">{slides[currentSlide]?.content}</div>
              {slides[currentSlide]?.notes && (
                <div className="mt-6 pt-4 border-t border-primary/20">
                  <p className="text-sm text-muted-foreground">{t('Speaker notes:')}</p>
                  <p className="text-sm mt-2">{slides[currentSlide]?.notes}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                {t('Previous')}
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentSlide + 1} / {slides.length}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                disabled={currentSlide === slides.length - 1}
              >
                {t('Next')}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
