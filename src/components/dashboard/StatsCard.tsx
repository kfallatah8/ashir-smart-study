
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/use-language';

interface StatsCardProps {
  title: string;
  value: number | string;
  description: string;
  progress?: number;
  icon?: React.ReactNode;
  color?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  description, 
  progress, 
  icon,
  color = 'bg-primary' 
}: StatsCardProps) {
  const { t } = useLanguage();
  
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{t(title)}</p>
            <h3 className="text-2xl font-bold mt-1">
              {typeof value === 'string' && value.includes('Days') 
                ? value.replace('Days', t('Days')) 
                : value}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{t(description)}</p>
          </div>
          {icon && (
            <div className={`w-10 h-10 rounded-full ${color} bg-opacity-20 flex items-center justify-center`}>
              {icon}
            </div>
          )}
        </div>
        
        {progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-500">{t('Progress')}</span>
              <span className="text-xs font-medium text-gray-700">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
