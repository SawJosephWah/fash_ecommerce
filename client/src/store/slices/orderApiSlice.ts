import type { ApiResponse, ConfirmOrderResponse, CreateOrderRequest } from '@/Types/Order';
import { apiSlice } from './apiSlice';

export interface CreateOrderResponse {
  status: string;
  data: string; // The Stripe URL
}

// Define the shape of the API Response for standard endpoints


export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Existing: Start Checkout
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (orderData) => ({
        url: '/orders/create-order',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Product', 'Order' as any], 
    }),

    // 2. Existing: Verify Session
    confirmOrder: builder.query<ConfirmOrderResponse, string>({
      query: (sessionId) => ({
        url: `/orders/confirm/${sessionId}`,
        method: 'GET',
      }),
      providesTags: ['Order' as any],
    }),

    // 3. NEW: Get User Orders
    getMyOrders: builder.query<any[], void>({
      query: () => '/orders',
      transformResponse: (response: ApiResponse) => response.data,
      providesTags: ['Order']
    }),

    getAllOrders: builder.query<any[], void>({
      query: () => '/orders/all',
      transformResponse: (response: ApiResponse) => response.data,
      providesTags: ['Order'],
    }),

    updateOrderStatus: builder.mutation<any, { orderId: string; status: string }>({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const { 
  useCreateOrderMutation, 
  useConfirmOrderQuery,
  useGetMyOrdersQuery,      // For User Profile/Orders page
  useGetAllOrdersQuery,     // For Admin Dashboard
  useUpdateOrderStatusMutation // For Admin Status Toggle
} = orderApiSlice;