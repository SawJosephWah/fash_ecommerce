import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Determine the base URL based on the environment mode
const getBaseUrl = () => {
  const isDevelopment = import.meta.env.VITE_MODE === 'development';
  
  return isDevelopment 
    ? import.meta.env.VITE_LOCAL_API_URL 
    : import.meta.env.VITE_API_URL;
};

const baseQuery = fetchBaseQuery({ 
  // Fallback to localhost if both env variables are missing
  baseUrl: getBaseUrl() || 'http://localhost:8000',
  credentials: 'include', 
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Product', 'User', 'Order'],
  endpoints: () => ({}),
});