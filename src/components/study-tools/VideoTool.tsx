import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import DocumentSelector, { Document } from './DocumentSelector';
import { useToast } from '@/hooks/use-toast';
import { useAITools } from '@/hooks/use-ai-tools';

export default function VideoTool() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isProcessing, generateTool, tasks } = useAITools(selectedDocument?.id || '');
  
  const completedTask = tasks.find(
    task => task.tool_type === 'video' && task.status === 'completed'
  );
  const videoScript = completedTask?.result?.script;

  const handleGenerate = async () => {
    if (!selectedDocument) {
      toast({
        title: t('No Document Selected'),
        description: t('Please select a document first'),
        variant: 'destructive'
      });
      return;
    }
    
    await generateTool('video');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Video className="mr-2 h-5 w-5" />
            {t('Generate Video Script')}
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
              <Video className="mr-2 h-4 w-4" />
            )}
            {isProcessing ? t('Generating...') : t('Generate Video Script')}
          </Button>

          {videoScript && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{videoScript.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t('Duration:')} {videoScript.duration}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {videoScript.scenes?.map((scene: any) => (
                  <div key={scene.id} className="border-l-4 border-primary pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {scene.timestamp}
                      </span>
                    </div>
                    <h4 className="font-medium mt-1">{scene.description}</h4>
                    <p className="text-sm mt-2 italic text-muted-foreground">
                      "{scene.narration}"
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
