import type { FilterMetadataResponse, Product } from '@/Types/Product';
import { apiSlice } from './apiSlice';

// Define types for your product response if available, 
// otherwise use 'any' or your IProduct interface
export interface ProductResponse {
  status: string;
  results: number;
  data: Product[];
}

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint for New Arrivals
    getNewArrivals: builder.query<ProductResponse, void>({
      query: () => ({
        url: '/products/new-arrivals',
        method: 'GET',
      }),
      providesTags: ['Product'], // Assumes you have 'Product' tag in your base apiSlice
    }),

    // Endpoint for Featured Products
    getFeaturedProducts: builder.query<ProductResponse, void>({
      query: () => ({
        url: '/products/featured',
        method: 'GET',
      }),
      providesTags: ['Product'],
    }),

    // Endpoint for Single Product Details
    getProductById: builder.query<any, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'GET',
      }),
      providesTags: (id) => [{ type: 'Product', id }],
    }),

    // Endpoint for Filtered Products (Search/Filters)
    getAllProducts: builder.query<ProductResponse, any>({
      query: (params) => ({
        url: '/products',
        method: 'GET',
        params: params, // Automatically converts { category: 't-shirt' } to ?category=t-shirt
      }),
      providesTags: ['Product'],
    }),

    getFilterMetadata: builder.query<FilterMetadataResponse, void>({
      query: () => ({
        url: '/products/filters',
        method: 'GET',
      }),
      // We use 'Product' tag so if a product is added/deleted, 
      // the filter ranges (like max price) stay updated.
      providesTags: ['Product'],
    }),

    createProduct: builder.mutation<any, FormData>({
      query: (newProductData) => ({
        url: '/products',
        method: 'POST',
        body: newProductData,
        // Do NOT set headers here, browser handles FormData boundaries
      }),
      invalidatesTags: ['Product'], // Refreshes your product lists automatically
    }),

    updateProduct: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/products/${id}`,
        method: 'PUT', // or PUT
        body: formData,
      }),
      invalidatesTags: ({ id }) => [
        { type: 'Product', id },
        'Product'
      ],
    }),
    deleteProduct: builder.mutation<{ status: string; message: string }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetNewArrivalsQuery,
  useGetFeaturedProductsQuery,
  useGetProductByIdQuery,
  useGetAllProductsQuery,
  useGetFilterMetadataQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} = productApiSlice;