// Type definitions for the IR system

export interface Student {
    id: number;
    firstName: string;
    lastName: string;
    studentNumber: string;
    email?: string;
    dateOfBirth?: string;
  }
  
  export interface Course {
    id: number;
    title: string;
    code: string;
    description?: string;
    credits?: number;
  }
  
  export interface Document {
    id: number;
    filename: string;
    snippet: string;
    filePath?: string;
  }
  
  export interface SearchResults {
    students: Student[];
    courses: Course[];
    documents: Document[];
  }
  
  export type SearchMode = 'exact' | 'fuzzy' | 'all';
  
  export interface SearchResponse extends SearchResults {
    query: string;
    mode: SearchMode;
    responseTime?: number;
  }