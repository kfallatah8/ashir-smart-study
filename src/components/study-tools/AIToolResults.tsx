
import React from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { 
  AIToolTask, 
  isMindMapResult, 
  isFlashcardsResult,
  FlashcardItem
} from '@/lib/documents';

interface AIToolResultsProps {
  tasks: AIToolTask[];
  isLoading: boolean;
  toolType: string;
}

const AIToolResults = ({ tasks, isLoading, toolType }: AIToolResultsProps) => {
  const { t } = useLanguage();
  
  const filteredTasks = tasks.filter(task => task.tool_type === toolType);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">
          {t(`You have no saved ${toolType.replace('_', ' ')}s yet`)}
        </p>
      </div>
    );
  }

  const renderResult = (task: AIToolTask) => {
    if (task.status !== 'completed' || !task.result) return null;

    if (toolType === 'mind_map' && isMindMapResult(task.result)) {
      return (
        <div className="text-sm">
          <p className="font-medium mb-2">Mind Map Structure:</p>
          <ul className="list-disc pl-5">
            {task.result.nodes.map((node) => (
              <li key={node.id}>
                {node.label} {node.type && `(${node.type})`}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    
    if (toolType === 'flashcards' && isFlashcardsResult(task.result)) {
      return (
        <div className="space-y-3">
          {task.result.cards.map((card: FlashcardItem, index: number) => (
            <div key={index} className="border p-3 rounded bg-white">
              <p className="font-medium">{card.question}</p>
              <p className="text-gray-600 mt-1">{card.answer}</p>
            </div>
          ))}
        </div>
      );
    }

    // Default rendering for other result types
    return (
      <pre className="whitespace-pre-wrap text-sm">
        {typeof task.result === 'object' 
          ? JSON.stringify(task.result, null, 2) 
          : String(task.result)}
      </pre>
    );
  };

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <Card key={task.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium capitalize">{toolType.replace('_', ' ')} #{task.id.substring(0, 8)}</h3>
              <div className="flex items-center">
                {task.status === 'completed' ? (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">{t('Completed')}</span>
                  </div>
                ) : task.status === 'failed' ? (
                  <div className="flex items-center text-red-500">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span className="text-xs">{t('Failed')}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-xs">{t('Processing')}</span>
                  </div>
                )}
              </div>
            </div>
            
            {task.status === 'completed' && task.result && (
              <div className="mt-4 border rounded p-4 bg-gray-50">
                {renderResult(task)}
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              {new Date(task.created_at || '').toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AIToolResults;
