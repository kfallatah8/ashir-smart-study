
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { File, Upload } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from "@/hooks/use-toast";
import { uploadDocument } from '@/lib/document-utils';
import { supabase } from '@/integrations/supabase/client';

export default function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const handleFileUpload = useCallback(async (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      
      if (!user) throw new Error('You must be logged in to upload files');

      const file = files[0];
      await uploadDocument(file, user.id);

      toast({
        title: t('Upload Complete'),
        description: t('Your file has been successfully uploaded'),
      });

      setUploadProgress(100);
    } catch (error: any) {
      toast({
        title: t('Upload Failed'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 3000);
    }
  }, [t, toast]);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  return (
    <Card 
      className={`transform-3d hover:element-3d border-2 border-dashed transition-all ${
        isDragging ? 'border-primary bg-primary-50' : 'border-gray-300'
      }`}
    >
      <CardContent className="p-6">
        <div
          className="w-full py-8"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary transform-3d hover:element-3d">
            {isUploading ? (
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <File className="h-8 w-8 animate-bounce-subtle" />
            )}
          </div>
          
          <div className="mt-4 text-center">
            <h3 className="text-lg font-medium text-gray-700">
              {t('Upload your documents')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('Drag and drop your files here, or click to browse')}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {t('Supports PDFs, Word documents, images, and handwritten notes')}
            </p>
          </div>

          {uploadProgress > 0 && (
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <div className="mt-4 flex justify-center">
            <label htmlFor="file-upload">
              <Button
                variant="outline"
                className="mx-auto border-primary text-primary hover:bg-primary hover:text-white transform-3d hover:element-3d"
                disabled={isUploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {t('Browse Files')}
              </Button>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                multiple={false}
              />
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
