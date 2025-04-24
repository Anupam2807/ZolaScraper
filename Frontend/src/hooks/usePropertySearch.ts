import { useState } from 'react';
import { ZoningDetails, SearchHistoryItem } from '../types';
import { searchProperty } from '../services/api';

const MAX_HISTORY_ITEMS = 5;
const HISTORY_STORAGE_KEY = 'propertySearchHistory';

export function usePropertySearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyData, setPropertyData] = useState<ZoningDetails | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const fetchPropertyData = async (address: string) => {
    if (!address.trim()) {
      setError('Please enter a property address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchProperty(address);
      setPropertyData(data);
      
      // Update search history
      const newHistoryItem: SearchHistoryItem = {
        address,
        timestamp: Date.now()
      };
      
      const updatedHistory = [
        newHistoryItem,
        ...searchHistory.filter(item => item.address !== address)
      ].slice(0, MAX_HISTORY_ITEMS);
      
      setSearchHistory(updatedHistory);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setPropertyData(null);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setPropertyData(null);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  };

  return {
    loading,
    error,
    propertyData,
    searchHistory,
    fetchPropertyData,
    clearResults,
    clearHistory
  };
}