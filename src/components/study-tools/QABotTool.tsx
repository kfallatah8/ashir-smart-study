import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import DocumentSelector, { Document } from './DocumentSelector';
import { useToast } from '@/hooks/use-toast';
import { useAITools } from '@/hooks/use-ai-tools';

export default function QABotTool() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isProcessing, generateTool, tasks } = useAITools(selectedDocument?.id || '');
  
  const completedTask = tasks.find(
    task => task.tool_type === 'qa_bot' && task.status === 'completed'
  );
  const qaKnowledgeBase = completedTask?.result?.qa_pairs || [];

  const handleLoadKnowledge = async () => {
    if (!selectedDocument) {
      toast({
        title: t('No Document Selected'),
        description: t('Please select a document first'),
        variant: 'destructive'
      });
      return;
    }
    
    await generateTool('qa_bot');
  };

  const handleSend = () => {
    if (!selectedDocument) {
      toast({
        title: t('No Document Selected'),
        description: t('Please select a document first'),
        variant: 'destructive'
      });
      return;
    }
    
    if (!input.trim()) return;
    
    const userQuestion = input.trim();
    setMessages([...messages, { role: 'user', content: userQuestion }]);
    setInput('');
    setIsAnswering(true);
    
    // Find answer from knowledge base
    setTimeout(() => {
      const matchingQA = qaKnowledgeBase.find(qa => 
        qa.question.toLowerCase().includes(userQuestion.toLowerCase()) ||
        userQuestion.toLowerCase().includes(qa.question.toLowerCase())
      );
      
      const answer = matchingQA 
        ? matchingQA.answer 
        : t('I don\'t have a specific answer for that question. Please try rephrasing or asking about the main topics covered in the document.');
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: answer
      }]);
      setIsAnswering(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            {t('Q&A Bot')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DocumentSelector
            onSelect={setSelectedDocument}
            selectedDocumentId={selectedDocument?.id}
          />
          
          {selectedDocument && !completedTask && (
            <Button 
              onClick={handleLoadKnowledge}
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MessageSquare className="mr-2 h-4 w-4" />
              )}
              {isProcessing ? t('Loading...') : t('Load Document Knowledge')}
            </Button>
          )}

          {selectedDocument && completedTask && (
            <>
              <div className="text-sm text-muted-foreground">
                {t('Knowledge base loaded with')} {qaKnowledgeBase.length} {t('Q&A pairs')}
              </div>
              
              <Card className="h-[400px] flex flex-col">
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      {t('Ask me anything about the document!')}
                    </div>
                  )}
                  {messages.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.role === 'user' 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isAnswering && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <div className="p-4 border-t flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={t('Ask a question about the document...')}
                    disabled={isAnswering}
                  />
                  <Button onClick={handleSend} disabled={isAnswering}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
