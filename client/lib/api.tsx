import { SearchResults, SearchMode } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Backend API response structure
 */
interface ApiResponse {
  status: 'success' | 'error';
  data: SearchResults;
  timeMs: number;
  message?: string;
}

/**
 * Fetch search results from the IR backend
 * @param query - Search query string
 * @param mode - Search mode (exact, fuzzy, or all)
 * @returns Promise with search results and response time
 */
export async function searchAPI(
  query: string,
  mode: SearchMode
): Promise<{ results: SearchResults; responseTime: number; backendTime: number }> {
  const startTime = performance.now();
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}&mode=${mode}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // ✅ Backend returns { status, data, timeMs }
    const json: ApiResponse = await response.json();
    
    // Check if backend returned an error
    if (json.status === 'error') {
      throw new Error(json.message || 'Backend returned an error');
    }

    const results: SearchResults = json.data;
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime); // Total round-trip time
    const backendTime = json.timeMs; // Backend processing time

    return { results, responseTime, backendTime };
  } catch (error) {
    console.error('Search API Error:', error);
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend. Ensure server is running on port 5000.');
    }
    
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to fetch search results. Ensure backend is running on port 5000.'
    );
  }
}

/**
 * Get total count of results across all categories
 */
export function getTotalResults(results: SearchResults): number {
  return (
    results.students.length +
    results.courses.length +
    results.documents.length
  );
}

/**
 * Check if search results are empty
 */
export function hasResults(results: SearchResults): boolean {
  return getTotalResults(results) > 0;
}

/**
 * Get the category with most results
 */
export function getMostPopulatedCategory(results: SearchResults): 'students' | 'courses' | 'documents' | null {
  const counts = {
    students: results.students.length,
    courses: results.courses.length,
    documents: results.documents.length,
  };

  const max = Math.max(...Object.values(counts));
  if (max === 0) return null;

  return Object.keys(counts).find(key => counts[key as keyof typeof counts] === max) as 'students' | 'courses' | 'documents';
}