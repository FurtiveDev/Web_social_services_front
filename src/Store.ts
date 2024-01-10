import { configureStore } from "@reduxjs/toolkit";
import mainDataReducer from "Slices/MainSlice";
import detailedDataReducer from 'Slices/DetailedSlice';
import authDataReducer from "Slices/AuthSlice";
import applicationsDataReducer from 'Slices/ApplicationsSlice';

const store = configureStore({
  reducer: {
    mainData: mainDataReducer,
    detailedData: detailedDataReducer,
    authData: authDataReducer,
    applicationsData: applicationsDataReducer,
  },
  // Это необязательно, так как Redux Toolkit автоматически интегрирует DevTools
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;