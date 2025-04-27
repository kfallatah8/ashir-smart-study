
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { File, Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from "@/hooks/use-toast";
import { uploadDocument } from '@/lib/document-utils';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

export default function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Reset status after successful upload
  useEffect(() => {
    if (uploadStatus === 'success') {
      const timer = setTimeout(() => {
        setUploadStatus('idle');
        setUploadProgress(0);
        setFileName(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);
  
  const handleFileUpload = useCallback(async (files: FileList) => {
    if (files.length === 0) return;
    
    const file = files[0];
    setFileName(file.name);
    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    try {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      
      if (!user) throw new Error('You must be logged in to upload files');

      // Simulate progress updates (since we can't get real progress from current implementation)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) clearInterval(progressInterval);
          return Math.min(90, prev + 10);
        });
      }, 300);
      
      await uploadDocument(file, user.id);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
      
      toast({
        title: t('Upload Complete'),
        description: t('Your file has been successfully uploaded'),
      });
    } catch (error: any) {
      setUploadStatus('error');
      toast({
        title: t('Upload Failed'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
            {uploadStatus === 'uploading' ? (
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : uploadStatus === 'success' ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : uploadStatus === 'error' ? (
              <AlertTriangle className="h-8 w-8 text-red-500" />
            ) : (
              <File className="h-8 w-8 animate-bounce-subtle" />
            )}
          </div>
          
          <div className="mt-4 text-center">
            <h3 className="text-lg font-medium text-gray-700">
              {uploadStatus === 'uploading' ? t('Uploading your document...') :
               uploadStatus === 'success' ? t('Upload complete!') :
               uploadStatus === 'error' ? t('Upload failed') :
               t('Upload your documents')}
            </h3>
            
            {fileName ? (
              <p className="mt-1 text-sm text-gray-500">
                {fileName}
              </p>
            ) : (
              <>
                <p className="mt-1 text-sm text-gray-500">
                  {t('Drag and drop your files here, or click to browse')}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {t('Supports PDFs, Word documents, images, and handwritten notes')}
                </p>
              </>
            )}
          </div>

          {(uploadProgress > 0 || uploadStatus === 'uploading') && (
            <div className="mt-4 w-full">
              <Progress 
                value={uploadProgress} 
                className="h-2.5" 
                indicatorClassName={uploadStatus === 'success' ? 'bg-green-500' : uploadStatus === 'error' ? 'bg-red-500' : 'bg-primary'}
              />
              <p className="text-xs text-center mt-1 text-gray-500">
                {uploadProgress}% {uploadStatus === 'uploading' ? t('uploading...') : ''}
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-center">
            <label htmlFor="file-upload">
              <Button
                variant="outline"
                className={`mx-auto border-primary text-primary hover:bg-primary hover:text-white transform-3d hover:element-3d ${
                  (uploadStatus === 'uploading' || uploadStatus === 'success') ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={uploadStatus === 'uploading' || uploadStatus === 'success'}
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
                disabled={uploadStatus === 'uploading' || uploadStatus === 'success'}
              />
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
