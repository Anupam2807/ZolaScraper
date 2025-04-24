import React from 'react';
import { Search, Home } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12 px-4">
      <div className="bg-blue-50 inline-flex rounded-full p-4 mb-4">
        <Home className="text-blue-500" size={32} />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Find Property Information</h2>
      <p className="text-gray-600 max-w-md mx-auto mb-4">
        Enter a property address above to see detailed information about the property, including price history, features, and neighborhood data.
      </p>
      <div className="flex justify-center">
        <div className="flex items-center text-blue-600 font-medium">
          <Search size={18} className="mr-2" />
          Start by searching for a property
        </div>
      </div>
    </div>
  );
};

export default EmptyState;