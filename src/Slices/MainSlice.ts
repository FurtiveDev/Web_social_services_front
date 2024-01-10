import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";


interface SubscriptionData {
  id: number,
  title: string,
  info: string,
  src: string,
  loc: string,
  sup: string
}

interface DataState {
  titleValue: string;
  subscriptions: SubscriptionData[];
  priceValues: number[];
  isSubscriptionsLoading: boolean;
  isMainPage: boolean;
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    titleValue: '',
    subscriptions: [],
    priceValues: [0, 10000],
    isSubscriptionsLoading: false,
    isMainPage: false
  } as DataState,
  reducers: {
    setTitleValue(state, action: PayloadAction<string>) {
      state.titleValue = action.payload
    },
    setSubscriptions(state, action: PayloadAction<SubscriptionData[]>) {
      console.log('pay is', action.payload)
      state.subscriptions = action.payload
    },
    setPriceValues(state, action: PayloadAction<number[]>) {
      state.priceValues = action.payload
    },
    setIsSubscriptionsLoading(state, action: PayloadAction<boolean>) {
      state.isSubscriptionsLoading = action.payload
    },
    setIsMainPage(state, action: PayloadAction<boolean>) {
      state.isMainPage = action.payload
    }
  },
});

// Состояние, которое будем отображать в компонентах

  
export const useTitleValue = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.titleValue);

export const useSubscriptions = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.subscriptions);

export const usePriceValues = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.priceValues);

export const useIsSubscriptionsLoading = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.isSubscriptionsLoading);

export const useIsMainPage = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.isMainPage);

export const {
    setTitleValue: setTitleValueAction,
    setSubscriptions: setSubscriptionsAction,
    setIsSubscriptionsLoading: setIsSubscriptionsLoadingAction,
    setIsMainPage: setIsMainPageAction
} = dataSlice.actions;

export default dataSlice.reducer;