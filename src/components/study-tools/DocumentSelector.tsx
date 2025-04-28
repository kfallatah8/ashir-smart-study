
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getUserDocuments } from '@/lib/document-utils';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';

export interface Document {
  id: string;
  title: string;
  file_type: string;
  file_path: string;
}

interface DocumentSelectorProps {
  onSelect: (document: Document) => void;
  selectedDocumentId?: string;
}

export default function DocumentSelector({ onSelect, selectedDocumentId }: DocumentSelectorProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setIsLoading(true);
        const docs = await getUserDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error('Error loading documents:', error);
        toast({
          title: t('Error'),
          description: t('Failed to load documents'),
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDocuments();
  }, [toast, t]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">{t('No documents found')}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/documents'}
        >
          {t('Upload a document')}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {documents.map((doc) => (
        <Card 
          key={doc.id}
          className={`cursor-pointer transition-colors hover:bg-gray-50 ${
            selectedDocumentId === doc.id ? 'border-primary border-2' : ''
          }`}
          onClick={() => onSelect(doc)}
        >
          <CardContent className="p-4 flex items-center">
            <div className="bg-primary-100 p-2 rounded-lg mr-3">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium line-clamp-1">{doc.title}</h3>
              <p className="text-xs text-gray-500">
                {doc.file_type.split('/')[1]?.toUpperCase() || doc.file_type}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
