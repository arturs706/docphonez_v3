"use client"; // this is a client component 👈🏽


import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    data: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    fetchProductsStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchProductsSuccess(state, action) {
      state.isLoading = false;
      state.data = action.payload;
    },
    fetchProductsFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure } = productSlice.actions;


export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch(fetchProductsStart());
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/products');
    const data = await response.json();
    dispatch(fetchProductsSuccess(data.products));
    console.log(data.products)
  } catch (error) {
    dispatch(fetchProductsFailure(error.message));
  }
};


export default productSlice.reducer;