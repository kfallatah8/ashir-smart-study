
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Plus, Search, Filter, Share2, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import UploadZone from '@/components/upload/UploadZone';
import DocumentProgress from '@/components/documents/DocumentProgress';
import ShareDocumentHelper from '@/components/documents/ShareDocumentHelper';
import { shareDocument, getSharedDocuments } from '@/lib/documents';

export default function Documents() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'my-documents' | 'shared-with-me'>('my-documents');
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const isRTL = language === 'ar';

  useEffect(() => {
    fetchDocuments();
    fetchSharedDocuments();
  }, [searchQuery]);

  const fetchDocuments = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      let query = supabase
        .from('documents')
        .select(`
          *,
          document_progress (
            progress_percentage,
            last_page_viewed
          )
        `)
        .eq('user_id', userData.user.id);

      if (searchQuery) {
        query = query.textSearch('document_vector', searchQuery);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: t('Error'),
          description: error.message,
          variant: "destructive",
        });
      } else {
        setDocuments(data || []);
      }
    } catch (error: any) {
      console.error('Error in fetchDocuments:', error);
      toast({
        title: t('Error'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchSharedDocuments = async () => {
    try {
      const shared = await getSharedDocuments();
      setSharedDocuments(shared);
    } catch (error: any) {
      console.error('Error fetching shared documents:', error);
    }
  };

  const handleShare = async (documentId: string) => {
    try {
      const fullName = prompt(t('Enter the recipient\'s full name exactly as it appears in their profile:'));
      if (!fullName) return;

      await shareDocument(documentId, fullName);
      toast({
        title: t('Success'),
        description: t('Document shared successfully'),
      });
    } catch (error: any) {
      console.error('Error sharing document:', error);
      toast({
        title: t('Error'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const currentDocuments = activeTab === 'my-documents' ? documents : sharedDocuments;

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className={cn(
          "flex justify-between items-center mb-6",
          isRTL && "flex-row-reverse"
        )}>
          <h1 className="text-2xl font-bold">{t('My Documents')}</h1>
          <Button 
            className={cn("flex items-center", isRTL && "flex-row-reverse")}
            onClick={() => {
              const uploadSection = document.getElementById('upload-section');
              if (uploadSection) {
                uploadSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
            <span>{t('Upload Document')}</span>
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === 'my-documents' ? 'default' : 'outline'}
            onClick={() => setActiveTab('my-documents')}
          >
            {t('My Documents')} ({documents.length})
          </Button>
          <Button
            variant={activeTab === 'shared-with-me' ? 'default' : 'outline'}
            onClick={() => setActiveTab('shared-with-me')}
          >
            {t('Shared with Me')} ({sharedDocuments.length})
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
                  placeholder={t('Search documents...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className={cn("flex items-center", isRTL && "flex-row-reverse")}
              >
                <Filter className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                <span>{t('Filter')}</span>
              </Button>
            </div>

            {activeTab === 'my-documents' && <ShareDocumentHelper />}

            <div className="grid gap-4">
              {currentDocuments.map((doc) => (
                <div 
                  key={doc.id}
                  className="flex items-center border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transform-3d hover:element-3d"
                >
                  <div className={cn(
                    "bg-primary-100 p-3 rounded-lg",
                    isRTL ? "ml-4" : "mr-4"
                  )}>
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        {activeTab === 'shared-with-me' && (
                          <p className="text-sm text-gray-500">
                            {t('Shared by: ')} {doc.shared_by_profile?.full_name || 'Unknown'}
                          </p>
                        )}
                      </div>
                      {activeTab === 'my-documents' && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(doc.id);
                            }}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {doc.document_progress?.[0] && (
                      <DocumentProgress
                        progress={doc.document_progress[0].progress_percentage}
                        lastPage={doc.document_progress[0].last_page_viewed}
                      />
                    )}
                  </div>
                </div>
              ))}
              
              {currentDocuments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {activeTab === 'my-documents' 
                    ? t('No documents found. Upload your first document below!')
                    : t('No documents have been shared with you yet.')
                  }
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {activeTab === 'my-documents' && (
          <div id="upload-section" className="mb-8">
            <h2 className="text-xl font-bold mb-4">{t('Upload New Document')}</h2>
            <UploadZone />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
