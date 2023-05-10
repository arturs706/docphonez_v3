"use client"; // this is a client component 👈🏽

import { createSlice } from '@reduxjs/toolkit';

const getDiscountFromStorage = () => {
  if (typeof localStorage !== 'undefined') {
    const discount = localStorage.getItem('discount');
    if (discount) {
      const { value, expiresAt } = JSON.parse(discount);
      if (expiresAt && expiresAt < Date.now()) {
        localStorage.removeItem('discount');
        return null;
      }
      return value;
    }
  }
  return null;
};

const setDiscountToStorage = (discountAmount, expirationTime) => {
  const discount = { value: discountAmount, expiresAt: expirationTime };
  localStorage.setItem('discount', JSON.stringify(discount));
};

export const discountSlice = createSlice({
  name: 'discountSlice',
  initialState: {
    discountAmount: getDiscountFromStorage(),
  },
  reducers: {
    setDiscountSlice: (state, action) => {
      state.discountAmount = action.payload;
      setDiscountToStorage(action.payload, Date.now() + 60 * 1000);
    },
    clearDiscountSlice: (state) => {
      state.discountAmount = null;
      localStorage.removeItem('discount');
    },
  },
});

export const { setDiscountSlice, clearDiscountSlice } = discountSlice.actions;

export default discountSlice.reducer;
