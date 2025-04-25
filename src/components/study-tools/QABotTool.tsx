
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const QABotTool = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Array<{role: 'user' | 'bot', content: string}>>([]);
  const [inputValue, setInputValue] = useState('');
  const isRTL = language === 'ar';

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, {role: 'user', content: inputValue}]);
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'bot', 
        content: language === 'en' 
          ? "I'm your AI study assistant. To answer specific questions about your documents, please first select a document to study from the document selector."
          : "أنا مساعد الدراسة الذكي الخاص بك. للإجابة على أسئلة محددة حول مستنداتك، يرجى أولاً تحديد مستند للدراسة من منتقي المستندات."
      }]);
    }, 1000);
    
    setInputValue('');
  };

  return (
    <div className="space-y-6">
      <Card className="min-h-[500px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            {t('Q&A Bot')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <Tabs defaultValue="chat" className="w-full h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">{t('Chat')}</TabsTrigger>
              <TabsTrigger value="documents">{t('Documents')}</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="space-y-4 mt-4 h-[400px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-md">
                {messages.length === 0 ? (
                  <div className="text-center py-10">
                    <span className="text-6xl mb-4 block">🤖</span>
                    <h3 className="text-lg font-medium mb-2">{t('AI Study Assistant')}</h3>
                    <p className="text-sm text-gray-500">
                      {t('Ask me any questions about your documents')}
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.role === 'user' ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')}`}
                    >
                      <div 
                        className={`max-w-[75%] p-3 rounded-lg ${
                          msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t('Type your question...')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="documents">
              <div className="text-center py-10">
                <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('Select a Document')}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {t('Choose a document to ask questions about its content')}
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-yellow-700 text-sm">
                    {t('Please select a document from your library or upload a new one to chat about')}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default QABotTool;
