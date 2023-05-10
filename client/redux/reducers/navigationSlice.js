"use client"; // this is a client component 👈🏽


import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isHamburgerOpen: false,
};

export const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        toggleHamburger: (state) => {
            state.isHamburgerOpen = !state.isHamburgerOpen;
        }
    }
});

export const { toggleHamburger } = navigationSlice.actions;

export default navigationSlice.reducer;

    