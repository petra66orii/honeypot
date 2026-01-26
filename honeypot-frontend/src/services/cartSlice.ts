import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from './types';

// Define what a Cart Item looks like
export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (!existingItem) {
        // If item not in bag, add it with quantity 1
        state.items.push({ ...newItem, quantity: 1 });
      } else {
        // If item exists, just increase quantity
        existingItem.quantity++;
      }
      
      state.totalQuantity++;
      state.totalAmount += parseFloat(newItem.price);
    },
    
    removeFromCart(state, action: PayloadAction<number>) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        state.items = state.items.filter((item) => item.id !== id);
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= parseFloat(existingItem.price) * existingItem.quantity;
      }
    },

    updateQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem && quantity > 0) {
        // Calculate difference to update totals correctly
        const quantityDifference = quantity - existingItem.quantity;
        
        existingItem.quantity = quantity;
        state.totalQuantity += quantityDifference;
        state.totalAmount += parseFloat(existingItem.price) * quantityDifference;
      }
    },
    
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;