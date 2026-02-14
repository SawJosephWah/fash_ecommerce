import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// We get the URL from the .env file we configured earlier in Docker
const baseQuery = fetchBaseQuery({ 
  baseUrl: import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:8000',
  // This ensures cookies are sent with every request (CORS requirement)
  credentials: 'include', 
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Product', 'User', 'Order'],
  endpoints: () => ({
  }),
});