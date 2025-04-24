import React from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PropertyCard from './components/PropertyCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import EmptyState from './components/EmptyState';
import { usePropertySearch } from './hooks/usePropertySearch';

function App() {
  const { 
    loading, 
    error, 
    propertyData, 
    searchHistory, 
    fetchPropertyData, 
    clearHistory 
  } = usePropertySearch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Find Detailed Property Information
            </h2>
            <SearchBar 
              onSearch={fetchPropertyData} 
              searchHistory={searchHistory}
              clearHistory={clearHistory}
              loading={loading}
            />
          </div>

          <div className="mt-8">
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : propertyData ? (
              <PropertyCard property={propertyData} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} ZOLA Property Insights. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;