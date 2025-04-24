
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Check } from 'lucide-react';

export default function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  
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
    
    // Simulate file upload
    const files = e.dataTransfer.files;
    if (files.length) {
      simulateUpload(files);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      simulateUpload(files);
    }
  };
  
  const simulateUpload = (files: FileList) => {
    setIsUploading(true);
    
    // Simulate an upload process
    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
      
      // Reset after a few seconds
      setTimeout(() => {
        setUploadComplete(false);
      }, 3000);
    }, 2000);
  };
  
  return (
    <Card className={`border-2 border-dashed transition-all ${isDragging ? 'border-primary bg-primary-50' : 'border-gray-300'}`}>
      <CardContent className="p-6 flex flex-col items-center justify-center text-center">
        {isUploading ? (
          <div className="py-8 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">Uploading document...</p>
            <p className="text-sm text-gray-500 mt-2">This will just take a moment</p>
          </div>
        ) : uploadComplete ? (
          <div className="py-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <Check className="w-8 h-8" />
            </div>
            <p className="mt-4 text-gray-600 font-medium">Upload Complete!</p>
            <p className="text-sm text-gray-500 mt-2">Your document is ready for processing</p>
          </div>
        ) : (
          <div
            className="w-full py-8"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary">
              <Upload className="h-8 w-8" />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-700">Upload your documents</h3>
              <p className="mt-1 text-sm text-gray-500">
                Drag and drop your files here, or click to browse
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Supports PDFs, Word documents, images, and handwritten notes
              </p>
            </div>
            <div className="mt-4">
              <label htmlFor="file-upload">
                <Button
                  variant="outline"
                  className="mx-auto border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileSelect}
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
