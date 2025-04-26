import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { File, Upload } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from "@/hooks/use-toast";

export default function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileUpload(files);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      handleFileUpload(files);
    }
  };
  
  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    setUploadComplete(true);
    
    toast({
      title: t('Upload Complete'),
      description: t('Your files have been successfully uploaded'),
      variant: "default",
    });
    
    setTimeout(() => {
      setUploadComplete(false);
    }, 3000);
  };
  
  return (
    <Card className={`transform-3d hover:element-3d border-2 border-dashed transition-all ${isDragging ? 'border-primary bg-primary-50' : 'border-gray-300'}`}>
      <CardContent className="p-6">
        {isUploading ? (
          <div className="py-8 flex flex-col items-center animate-fade-in">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">{t('Uploading document...')}</p>
            <p className="text-sm text-gray-500 mt-2">{t('This will just take a moment')}</p>
          </div>
        ) : uploadComplete ? (
          <div className="py-8 flex flex-col items-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <div className="transform-3d animate-bounce-subtle">✓</div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">{t('Upload Complete!')}</p>
            <p className="text-sm text-gray-500 mt-2">{t('Your document is ready for processing')}</p>
          </div>
        ) : (
          <div
            className="w-full py-8"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary transform-3d hover:element-3d">
              <File className="h-8 w-8 animate-bounce-subtle" />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-700">{t('Upload your documents')}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {t('Drag and drop your files here, or click to browse')}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {t('Supports PDFs, Word documents, images, and handwritten notes')}
              </p>
            </div>
            <div className="mt-4">
              <label htmlFor="file-upload">
                <Button
                  variant="outline"
                  className="mx-auto border-primary text-primary hover:bg-primary hover:text-white transform-3d hover:element-3d"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {t('Browse Files')}
                </Button>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={e => e.target.files && handleFileUpload(e.target.files)}
                  multiple
                />
              </label>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
