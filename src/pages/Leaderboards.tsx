
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Leaderboards = () => {
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Leaderboards</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-600">See how you rank against other students</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Leaderboards;
