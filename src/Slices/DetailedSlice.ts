import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

interface ServiceData {
  id: number,
  title: string,
  info: string,
  src: string,
  loc: string,
  sup: string,
}

interface DataState {
  subscription: ServiceData,
  LinksMapData: Map<string, string>
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    subscription: {},
    LinksMapData: new Map<string, string>([['Услуги', '/']])
  } as DataState,
  reducers: {
    setService(state, action: PayloadAction<ServiceData>) {
        state.subscription = action.payload
    },
    setLinksMapData(state, action: PayloadAction<Map<string, string>>) {
      console.log(action.payload)
      state.LinksMapData = action.payload
  },
  },
});

export const useService = () =>
  useSelector((state: { detailedData: DataState }) => state.detailedData.subscription);

export const useLinksMapData = () =>
  useSelector((state: { detailedData: DataState }) => state.detailedData.LinksMapData);

export const {
    setService: setServiceAction,
    setLinksMapData: setLinksMapDataAction
} = dataSlice.actions;

export default dataSlice.reducer;