import React from 'react';
import { Building2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 size={28} className="text-teal-400" />
          <div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">ZOLA Property Insights</h1>
            <p className="text-xs text-blue-200 md:text-sm">Discover detailed property information</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;