
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const studyTools = [
  {
    id: 1,
    title: "Mind Maps",
    description: "Visual learning aids",
    icon: "🧠",
    color: "bg-accent-100",
  },
  {
    id: 2,
    title: "Flashcards",
    description: "Memory reinforcement",
    icon: "🃏",
    color: "bg-primary-100",
  },
  {
    id: 3,
    title: "Presentations",
    description: "Summarized content",
    icon: "📊",
    color: "bg-secondary-100",
  },
  {
    id: 4,
    title: "ELI5 Explanations",
    description: "Simplified concepts",
    icon: "👶",
    color: "bg-green-100",
  },
  {
    id: 5,
    title: "Q&A Bot",
    description: "Interactive learning",
    icon: "🤖",
    color: "bg-yellow-100",
  },
  {
    id: 6,
    title: "Video Explainer",
    description: "Visual tutorials",
    icon: "🎬",
    color: "bg-red-100",
  }
];

export default function StudyToolsCard() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">AI Study Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {studyTools.map((tool) => (
            <div 
              key={tool.id} 
              className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all hover:scale-105"
            >
              <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center text-2xl`}>
                {tool.icon}
              </div>
              <h4 className="mt-2 text-sm font-medium">{tool.title}</h4>
              <p className="text-xs text-gray-500">{tool.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
