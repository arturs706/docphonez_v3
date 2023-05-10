"use client"; // this is a client component 👈🏽

import { createSlice } from '@reduxjs/toolkit';



const getCartFromStorage = () => {
  if (typeof localStorage !== 'undefined') {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }
  return [];
};

const setCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState: getCartFromStorage(),
  reducers: {
    addToCart: (state, action) => {
      const itemExists = state.find((item) => item.productid === action.payload.productid);
      if (itemExists) {
        itemExists.quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
      setCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      const newState = state.filter((item) => item.productid !== action.payload);
      setCartToStorage(newState);
      return newState;
    },
    incrementQuantity: (state, action) => {
      const item = state.find((item) => item.productid === action.payload);
      item.quantity += 1;
      setCartToStorage(state);
    },
    decrementQuantity: (state, action) => {
      const item = state.find((item) => item.productid === action.payload);
      if (item.quantity > 1) {
        item.quantity -= 1;
        setCartToStorage(state);
      } else if (item.quantity === 1) {
        const newState = state.filter((item) => item.productid !== action.payload);
        setCartToStorage(newState);
        return newState;
      }
    },
    changeTheQuantity: (state, action) => {
      const item = state.find((item) => item.productid === action.payload.productid);
      item.quantity = action.payload.quantity;
      setCartToStorage(state);
    },
    clearCart: () => {
      setCartToStorage([]);
      return [];
    }
  }
});

export const selectCartItems = (state) => state.cart;

export const {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
