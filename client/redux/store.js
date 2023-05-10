import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../redux/reducers/cartSlice'
import profileReducer from '../redux/reducers/profileSlice'
import { HYDRATE } from 'next-redux-wrapper'
import productReducer from '../redux/reducers/productSlice';
import navigationReducer from '../redux/reducers/navigationSlice';
import timeslotSliceReducer from '../redux/reducers/timeslotSlice';
import discountReducer from '../redux/reducers/discountSlice';


export const store = configureStore({
  reducer: {
    counter: counterReducer,
    profile: profileReducer,
    products: productReducer,
    navigation: navigationReducer,
    timeSlotSlice: timeslotSliceReducer,
    discountSlice: discountReducer
    },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [HYDRATE],
      },
    }),
})