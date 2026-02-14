import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  size: string;
  color: string;
  instock_count: number; 
}

interface CartState {
  cartItems: CartItem[];
}

// 1. Initial state is now just a simple empty array
const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, '_id'>>) => {
      const item = action.payload;
      const generatedId = `${item.productId}-${item.size}-${item.color}`;
      const existItem = state.cartItems.find((x) => x._id === generatedId);

      if (existItem) {
        const index = state.cartItems.findIndex(x => x._id === generatedId);
        state.cartItems[index].quantity += item.quantity;
      } else {
        state.cartItems.push({ ...item, _id: generatedId });
      }
    },

    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((x) => x._id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      // REMOVED: localStorage.setItem
    },

    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((x) => x._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }

    },

    clearCart: (state) => {
      state.cartItems = [];
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
    },
  },
});

export const { 
  addToCart, 
  increaseQuantity, 
  decreaseQuantity, 
  clearCart, 
  removeFromCart 
} = cartSlice.actions;

export default cartSlice.reducer;