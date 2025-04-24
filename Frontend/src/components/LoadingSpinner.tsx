import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-16 w-16 rounded-full border-4 border-blue-100 border-t-blue-800 animate-spin mb-4"></div>
      <p className="text-blue-800 font-medium animate-pulse">Gathering property information...</p>
    </div>
  );
};

export default LoadingSpinner;