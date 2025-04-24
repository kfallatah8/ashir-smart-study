
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function WelcomeCard() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Card className="bg-gradient-to-r from-primary to-secondary text-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-primary-100">{getGreeting()}</p>
            <h2 className="text-2xl font-bold mt-1">Welcome back, Ahmed!</h2>
            <p className="mt-2 text-primary-100">
              You have <span className="font-bold text-white">3 subjects</span> to study today and an exam in <span className="font-bold text-white">5 days</span>.
            </p>
          </div>
          <div className="w-24 h-24 flex items-center justify-center">
            <img src="/placeholder.svg" alt="Study" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="mt-4 flex space-x-3">
          <button className="px-4 py-2 bg-white text-primary font-medium rounded-lg hover:bg-primary-100 transition-colors">
            Upload Document
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
            Study Now
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
