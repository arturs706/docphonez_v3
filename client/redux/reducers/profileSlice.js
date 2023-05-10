"use client"; // this is a client component 👈🏽


import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    token: null,
    email: null,
    role : null,
    tokenExp: null,
    userid: null
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.token = action.payload;
        },
        setEmailAdd: (state, action) => {
            state.email = action.payload;
        },
        setUserRole: (state, action) => {
            state.role = action.payload;
        }, 
        setTokenExp: (state, action) => {
            state.tokenExp = action.payload;
        },
        setUserId: (state, action) => {
            state.userid = action.payload;
        },
        clearProfile: (state) => {
            state.token = null;
            state.email = null;
            state.role = null;
            state.tokenExp = null;
            state.userid = null;
        },
    }
});

export const { setProfile, setEmailAdd, setUserRole, setTokenExp, setUserId, clearProfile } = profileSlice.actions;

export default profileSlice.reducer;