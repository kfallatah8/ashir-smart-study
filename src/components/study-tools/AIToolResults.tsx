
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  
  const filteredTasks = tasks.filter(task => task.tool_type === toolType);

  const toggleTaskExpand = (taskId: string) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

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

  const renderMindMap = (nodes: any[], edges: any[]) => {
    return (
      <div className="border rounded p-3 bg-white">
        <p className="font-medium mb-2">Mind Map Structure:</p>
        <ul className="list-disc pl-5">
          {nodes.map((node) => (
            <li key={node.id} className="mb-1">
              <span className="font-semibold">{node.label}</span>
              {node.type && <span className="text-gray-500"> ({node.type})</span>}
              {edges
                .filter(edge => edge.from === node.id || edge.to === node.id)
                .map((edge, i) => {
                  const connectedNode = nodes.find(n => 
                    (edge.from === node.id ? n.id === edge.to : n.id === edge.from)
                  );
                  return connectedNode ? (
                    <div key={`${node.id}-${i}`} className="ml-4 text-sm text-gray-600">
                      {edge.from === node.id ? '→ ' : '← '}
                      {connectedNode.label}
                      {edge.label && ` (${edge.label})`}
                    </div>
                  ) : null;
                })
              }
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  const renderFlashcards = (cards: FlashcardItem[]) => {
    return (
      <div className="space-y-3">
        {cards.map((card, index) => (
          <div key={card.id || index} className="border p-3 rounded bg-white">
            <p className="font-medium">{card.question}</p>
            <p className="text-gray-600 mt-1">{card.answer}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderResult = (task: AIToolTask) => {
    if (task.status !== 'completed' || !task.result) return null;

    if (isMindMapResult(task.result)) {
      return renderMindMap(task.result.nodes, task.result.edges);
    }
    
    if (isFlashcardsResult(task.result)) {
      return renderFlashcards(task.result.cards);
    }

    // Default rendering for other result types
    return (
      <pre className="whitespace-pre-wrap text-sm border p-3 rounded bg-white overflow-x-auto">
        {JSON.stringify(task.result, null, 2)}
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
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleTaskExpand(task.id)}
                  className="w-full mt-3 flex justify-between items-center border"
                >
                  <span>{expandedTasks[task.id] ? t('Hide Results') : t('Show Results')}</span>
                  {expandedTasks[task.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                
                {expandedTasks[task.id] && (
                  <div className="mt-4 border rounded p-4 bg-gray-50">
                    {renderResult(task)}
                  </div>
                )}
              </>
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
