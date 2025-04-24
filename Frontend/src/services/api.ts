import { ZoningDetails } from '../types';

export const searchProperty = async (address: string): Promise<ZoningDetails> => {
  try {
    console.log(`Searching for property: ${address}`);
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ address })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch property data');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch property data');
    }
    
    return result.data;
  } catch (error) {
    console.error('API error:', error);
    throw error instanceof Error ? error : new Error('An unknown error occurred');
  }
};