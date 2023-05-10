"use client"; // this is a client component 👈🏽


import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chosenTSlot: null,
};

export const timeslotSlice = createSlice({
    name: 'timeSlotSlice',
    initialState,
    reducers: {
        setTimeSlotSlice: (state, action) => {
            state.chosenTSlot = action.payload;
        }
    }
});

export const { setTimeSlotSlice } = timeslotSlice.actions;

export default timeslotSlice.reducer;

