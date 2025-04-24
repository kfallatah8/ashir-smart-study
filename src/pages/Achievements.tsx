
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const Achievements = () => {
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">My Achievements</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-600">Track your learning milestones and achievements</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Achievements;
