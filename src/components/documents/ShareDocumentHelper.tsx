
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export const ShareDocumentHelper = () => {
  return (
    <Alert className="mb-4">
      <Info className="h-4 w-4" />
      <AlertDescription>
        To share a document, enter the recipient's full name exactly as it appears in their profile. 
        You can find this in their user profile or ask them for their exact display name.
      </AlertDescription>
    </Alert>
  );
};

export default ShareDocumentHelper;
