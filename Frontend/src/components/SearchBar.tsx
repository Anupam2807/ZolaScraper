import React, { useState, useRef, useEffect } from 'react';
import { Search, Clock, X } from 'lucide-react';
import { SearchHistoryItem } from '../types';

interface SearchBarProps {
  onSearch: (address: string) => void;
  searchHistory: SearchHistoryItem[];
  clearHistory: () => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  searchHistory, 
  clearHistory,
  loading
}) => {
  const [address, setAddress] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onSearch(address);
      setShowHistory(false);
    }
  };

  const handleHistoryItemClick = (historyAddress: string) => {
    setAddress(historyAddress);
    onSearch(historyAddress);
    setShowHistory(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  };

  // Close history dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        historyRef.current && 
        !historyRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
            placeholder="Enter property address..."
            className="w-full py-4 pl-12 pr-4 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg border border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 text-gray-800 transition-all duration-300 focus:outline-none"
            disabled={loading}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" size={20} />
          {address && !loading && (
            <button
              type="button"
              onClick={() => setAddress('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={!address.trim() || loading}
          className="mt-3 w-full py-3 bg-blue-800 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full"></div>
              Searching...
            </>
          ) : (
            'Search Property'
          )}
        </button>
      </form>

      {/* Search History Dropdown */}
      {showHistory && searchHistory.length > 0 && (
        <div
          ref={historyRef}
          className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-fadeIn"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={16} className="mr-2" />
              Recent Searches
            </div>
            <button
              onClick={() => {
                clearHistory();
                setShowHistory(false);
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Clear All
            </button>
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {searchHistory.map((item, index) => (
              <li
                key={index}
                className="border-t border-gray-100 first:border-0"
              >
                <button
                  onClick={() => handleHistoryItemClick(item.address)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors duration-150 flex items-center justify-between"
                >
                  <span className="text-gray-800 truncate">{item.address}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatDate(item.timestamp)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;