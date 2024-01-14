import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";


interface ServiceData {
  id: number,
  title: string,
  info: string,
  src: string,
  loc: string,
  sup: string
}

interface DataState {
  titleValue: string;
  subscriptions: ServiceData[];
  priceValues: number[];
  isServicesLoading: boolean;
  isMainPage: boolean;
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    titleValue: '',
    subscriptions: [],
    priceValues: [0, 10000],
    isServicesLoading: false,
    isMainPage: false
  } as DataState,
  reducers: {
    setTitleValue(state, action: PayloadAction<string>) {
      state.titleValue = action.payload
    },
    setServices(state, action: PayloadAction<ServiceData[]>) {
      console.log('pay is', action.payload)
      state.subscriptions = action.payload
    },
    setPriceValues(state, action: PayloadAction<number[]>) {
      state.priceValues = action.payload
    },
    setIsServicesLoading(state, action: PayloadAction<boolean>) {
      state.isServicesLoading = action.payload
    },
    setIsMainPage(state, action: PayloadAction<boolean>) {
      state.isMainPage = action.payload
    }
  },
});

// Состояние, которое будем отображать в компонентах

  
export const useTitleValue = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.titleValue);

export const useServices = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.subscriptions);

export const usePriceValues = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.priceValues);

export const useIsServicesLoading = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.isServicesLoading);

export const useIsMainPage = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.isMainPage);

export const {
    setTitleValue: setTitleValueAction,
    setServices: setServicesAction,
    setIsServicesLoading: setIsServicesLoadingAction,
    setIsMainPage: setIsMainPageAction
} = dataSlice.actions;

export default dataSlice.reducer;