import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react';
import MainPage from 'pages/MainPage';
import SubscriptionsPage from 'pages/SubscriptionsPage';
import DetaliedPage from 'pages/DetaliedPage';
import RegistrationPage from 'pages/RegistrationPage';
import LoginPage from 'pages/LoginPage';
import CurrentApplicationPage from 'pages/CurrentApplicationPage';
import ApplicationsListPage from 'pages/ApplicationsListPage';
import SelectedApplicationPage from 'pages/SelectedApplicationPage';
import AdminSubscriptionsPage from 'pages/AdminSubscriptionsPage';
import axios, {AxiosResponse} from 'axios';
import Cookies from "universal-cookie";
import {useDispatch} from "react-redux";
import {setUserAction, setIsAuthAction, useIsAuth, useUser} from "../Slices/AuthSlice";
import {useIsSubscriptionsLoading, setIsSubscriptionsLoadingAction, setSubscriptionsAction} from "Slices/MainSlice";
import { setCurrentApplicationIdAction } from 'Slices/ApplicationsSlice'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { mockSubscriptions } from '../../consts';
import { setApplicationsAction, setCurrentApplicationDateAction, setSubscriptionsFromApplicationAction } from 'Slices/ApplicationsSlice'
import { useCurrentApplicationId } from 'Slices/ApplicationsSlice'
import AdminApplicationsPage from 'pages/AdminApplicationsPage/AdminApplicationsPage';

const cookies = new Cookies();


export type ReceivedSubscriptionData = {
  id_service: number,
  service_name: string,
  description: string,
  status: string,
  image: string,
  support_hours: string,
  location_service: string,
}

function App() {
  const dispatch = useDispatch();
  const isAuth = useIsAuth();
  const user = useUser();
  const isLoading = useIsSubscriptionsLoading();

  const getInitialUserInfo = async () => {
    console.log(cookies.get("session_id"))
    try {
      const response: AxiosResponse = await axios('http://localhost:8000/user_info',
      { 
        method: 'GET',
        withCredentials: true, 
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
      })

      console.log('initial!',response.data.email)
      dispatch(setIsAuthAction(true))
      dispatch(setUserAction({
        email: response.data.email,
        full_name: response.data.full_name,
        phone_number: response.data.phone_number,
        isSuperuser: response.data.is_superuser
      }))
      
    } 
    catch {
      console.log('Пользователь не авторизован!!!')
    }
  }


  const getSubscriptions = async () => {
    try {
        const response = await axios('http://localhost:8000/api/services/', {
            method: 'GET',
            withCredentials: true 
        });
        const subscriptions = response.data.services; 
        console.log("random",subscriptions)
        if (response.data.id_request) {
          getCurrentApplication(response.data.id_request);
          dispatch(setCurrentApplicationIdAction(response.data.id_request))
        }
        const newArr = subscriptions.map((raw: ReceivedSubscriptionData) => ({
            id: raw.id_service,
            title: raw.service_name,
            info: raw.description,
            src: raw.image,
            status: raw.status,
            loc: raw.location_service,
            sup: raw.support_hours
        }));
        dispatch(setSubscriptionsAction(newArr));
    }
    catch {
      dispatch(setSubscriptionsAction(mockSubscriptions));
    } finally {
      dispatch(setIsSubscriptionsLoadingAction(false))
    }
};

const getCurrentApplication = async (id: number) => {
  try {
    const response = await axios(`http://localhost:8000/api/requests/${id}`, {
      method: 'GET',
      withCredentials: true,
    })
    dispatch(setCurrentApplicationDateAction(response.data.application.creation_date))
    const newArr = response.data.map((raw: ReceivedSubscriptionData) => ({
      id: raw.id_service,
      title: raw.service_name,
      info: raw.description,
      src: raw.image,
      status: raw.status
  }));
  console.log("random!",response.data.application.creation_date)
  dispatch(setSubscriptionsFromApplicationAction(newArr))
  } catch(error) {
    
    throw error;
  }
}

  React.useEffect(() => {
    dispatch(setIsSubscriptionsLoadingAction(true))
    if (cookies.get("session_id")) {
      getInitialUserInfo();
    }
    getSubscriptions();
  }, [])

  return (
    <div className='app'>
      <HashRouter>
          <Routes>
              <Route path='/' element={<MainPage/>}/>
              <Route path="/services" element={<SubscriptionsPage />} />
              {isAuth && user.isSuperuser && <Route path="/admin" element={<AdminSubscriptionsPage />} />}
              {isAuth && user.isSuperuser && <Route path="/requests" element={<AdminApplicationsPage />} />}
              <Route path="/services">
                <Route path=":id" element={<DetaliedPage />} />
              </Route>
              {!isAuth && <Route path='/registration' element={<RegistrationPage/>}></Route>}
              {!isAuth && <Route path='/login' element={<LoginPage/>}></Route>}
              {isAuth && !user.isSuperuser && <Route path='/request' element={<CurrentApplicationPage/>}/>}
              {isAuth && !user.isSuperuser && <Route path='/requests' element={<ApplicationsListPage/>}></Route>}
              {isAuth && <Route path="/requests">
                <Route path=":id" element={<SelectedApplicationPage />} />
              </Route>}
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </HashRouter>
      <ToastContainer autoClose={1500} pauseOnHover={false} />
    </div>
    );
  }
  
export default App;