import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fadeIn">
      <div className="flex items-start">
        <AlertTriangle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="text-red-800 font-medium">Unable to retrieve property data</h3>
          <p className="text-red-700 mt-1">{message}</p>
          <p className="text-red-600 text-sm mt-2">
            Please check the address and try again, or try a different property address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;