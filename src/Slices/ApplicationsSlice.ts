import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

interface ServiceData {
  id: number;
  title: string;
  info: string;
  src: string;
  loc: string;
  sup: string;
}

interface ApplicationData {
  id: number;
  status: string;
  creation_date: string;
  completion_date: string;
  user: string;
  service_provided: boolean;
}

interface DataState {
  currentApplicationId: number | null;
  currentApplicationDate: string;
  subscriptionsFromApplication: ServiceData[];
  applications: ApplicationData[];
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    currentApplicationId: null,
    currentApplicationDate: '',
    subscriptionsFromApplication: [],
    applications: []
  } as DataState,
  reducers: {
    setCurrentApplicationId(state, action: PayloadAction<number>) {
      state.currentApplicationId = action.payload;
    },
    setCurrentApplicationDate(state, action: PayloadAction<string>) {
      state.currentApplicationDate = action.payload;
    },
    setServicesFromApplication(state, action: PayloadAction<ServiceData[]>) {
      state.subscriptionsFromApplication = action.payload;
    },
    setApplications(state, action: PayloadAction<ApplicationData[]>) {
      state.applications = action.payload;
      console.log('applications is', action.payload)
    }
  },
});

export const useCurrentApplicationId = () =>
  useSelector((state: { applicationsData: DataState }) => state.applicationsData.currentApplicationId);

export const useCurrentApplicationDate = () =>
  useSelector((state: { applicationsData: DataState }) => state.applicationsData.currentApplicationDate);

export const useSubscripitonsFromApplication = () =>
  useSelector((state: { applicationsData: DataState }) => state.applicationsData.subscriptionsFromApplication);

export const useApplications = () =>
  useSelector((state: { applicationsData: DataState }) => state.applicationsData.applications);

export const {
    setCurrentApplicationId: setCurrentApplicationIdAction,
    setCurrentApplicationDate: setCurrentApplicationDateAction,
    setServicesFromApplication: setServicesFromApplicationAction,
    setApplications: setApplicationsAction

} = dataSlice.actions;

export default dataSlice.reducer;