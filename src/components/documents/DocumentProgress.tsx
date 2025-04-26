
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/use-language';

interface DocumentProgressProps {
  progress: number;
  lastPage?: number;
  totalPages?: number;
}

export default function DocumentProgress({ progress, lastPage, totalPages }: DocumentProgressProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-500">
        <span>{t('Progress')}</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      {lastPage && totalPages && (
        <p className="text-xs text-gray-500">
          {t('Page')} {lastPage} {t('of')} {totalPages}
        </p>
      )}
    </div>
  );
}
