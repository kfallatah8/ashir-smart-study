
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';

const StudyZone = () => {
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Study Zone</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-600">Select a document to start studying with our AI tools</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudyZone;
