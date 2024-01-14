import React from 'react';
import { useState } from 'react';
import { useLocation as useReactRouterLocation } from 'react-router-dom';
import { Link } from 'react-router-dom'
import styles from './Header.module.scss'
import ProfileIcon from 'components/Icons/ProfileIcon';
import ApplicationIcon from 'components/Icons/ApplicationIcon';
import ProfileWindow from "components/ProfileWindow";
import BurgerIcon from 'components/Icons/BurgerIcon';
import { motion, AnimatePresence } from "framer-motion";
import axios, {AxiosResponse} from 'axios';
import {useDispatch} from "react-redux";
import {useUser, useIsAuth, setIsAuthAction, setUserAction} from "../../Slices/AuthSlice";
import Cookies from "universal-cookie";
import { toast } from 'react-toastify';
import {useIsSubscriptionsLoading, setIsSubscriptionsLoadingAction, setSubscriptionsAction} from "Slices/MainSlice";
import { useSubscripitonsFromApplication } from 'Slices/ApplicationsSlice';
import { useCurrentApplicationId } from 'Slices/ApplicationsSlice'
import { setApplicationsAction, setCurrentApplicationDateAction, setSubscriptionsFromApplicationAction } from 'Slices/ApplicationsSlice'
import { mockSubscriptions } from '../../../consts';
import { useNavigate } from 'react-router-dom';

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
export type ReceivedApplicationData = {
    id_request: number;
    status: string;
    creation_date: string;
    completion_date: string;
    user:string;
  }

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useReactRouterLocation();
    const dispatch = useDispatch();
    const [isProfileButtonClicked, setIsProfileButtonClicked] = useState(false);
    const [isBurgerMenuOpened, setIsBurgerMenuOpened] = useState(false)
    const isUserAuth = useIsAuth();
    const subscriptionsFromApplications = useSubscripitonsFromApplication();
    const currentApplicationId = useCurrentApplicationId();
    let user = useUser();

    const handleProfileButtonClick = () => {
        setIsProfileButtonClicked(!isProfileButtonClicked);
    };
    const getAllApplications = async () => {
        try {
          const response = await axios('http://localhost:8000/api/requests/', {
            method: 'GET',
            withCredentials: true
          })
          const newArr = response.data.map((raw: ReceivedApplicationData) => ({
            id: raw.id_request,
            status: raw.status,
            creation_date: raw.creation_date,
            completion_date: raw.completion_date,
            user: raw.user
        }));
        console.log('newArr is', response.data)
        dispatch(setApplicationsAction(newArr))
        navigate('/requests')
        } catch(error) {
          throw error
        }
    }

    const getSubscriptions = async () => {
        let url = 'http://localhost:8000/api/services/';
        try {
            const response = await axios(url, {
                method: 'GET',
                withCredentials: true 
            });
            const jsonData = response.data.services;
            const newArr = jsonData.map((raw: ReceivedSubscriptionData) => ({
                id: raw.id_service,
                title: raw.service_name,
                info: raw.description,
                src: raw.image,
                loc: raw.location_service,
                sup: raw.support_hours
            }));
            dispatch(setSubscriptionsAction(newArr));
            navigate('/services')
        }
        catch (error) {
                dispatch(setSubscriptionsAction(mockSubscriptions));
        } finally {
            dispatch(setIsSubscriptionsLoadingAction(false));
        }
    };

    const SubscriptionToApplicationlist = async () => {
        try {
            const response = await axios(`http://localhost:8000/api/requests/${currentApplicationId}/`, {
              method: 'GET',
              withCredentials: true,
            })
            dispatch(setCurrentApplicationDateAction(response.data.request.creation_date))
            const newArr = response.data.services.map((raw: ReceivedSubscriptionData) => ({
              id: raw.id_service,
              title: raw.service_name,
              info: raw.description,
              src: raw.image,
              loc: raw.location_service,
              sup: raw.support_hours,
              status: raw.status
          }));
        
          dispatch(setSubscriptionsFromApplicationAction(newArr))
          } catch(error) {
            console.log("random!")
            throw error;
          }
        }

    const logout = async () => {
        try {
            console.log(cookies.get('session_id'))
            const response: AxiosResponse = await axios('http://localhost:8000/logout',
            {
                method: "POST",
                withCredentials: true,
                headers: { 
                    "Content-type": "application/json; charset=UTF-8"
                }, 
            })

            cookies.remove("session_id", { path: "/" }); 

            dispatch(setIsAuthAction(false))
            dispatch(setUserAction({
                email: "",
                full_name: "",
                phone_number: "",
                isSuperuser: false
            }))
            setIsProfileButtonClicked(false);
        }
        catch(error) {
            console.log(error)
        }
    }

    const handleSubmit = async () => {
        await logout();
    };

    return (
        <div className={styles.header}>
            <div className={styles.header__wrapper}>
                <Link to='/' className={styles.header__logo}>ServicesForDisabled</Link>
    
                <div className={styles.header__blocks}>
                    <a className={styles.header__block} onClick={getSubscriptions}>Услуги</a> {/* Возможно переделать */}
                    {isUserAuth && user.isSuperuser && <Link className={styles.header__block} to={'/admin'}>Администрирование</Link>}
                    {isUserAuth && !user.isSuperuser ? 
                        <div className={styles.header__block} onClick={getAllApplications}>
                            Мои заявки
                        </div>
                        : isUserAuth && 
                            <div className={styles.header__block} onClick={getAllApplications}>
                                    Заявки
                            </div>
                                }
                    {/* {!user.isSuperuser &&  <Link className={styles.header__block} to='/'>Поддержка</Link>} */}
                </div>
    
                <div className={styles.header__icons}>
                    
                        {isUserAuth && !user.isSuperuser &&
                            <div className={styles['application__icon-wrapper']} onClick={SubscriptionToApplicationlist}>
                                <Link
                                    to={`/request/${currentApplicationId}`}
                                    style={{
                                        display: location.pathname === '/requests' ? 'none' : 'block',
                                        pointerEvents: subscriptionsFromApplications.length === 0 ? 'none' : 'auto',
                                        color: subscriptionsFromApplications.length === 0 ? 'gray' : 'inherit',
                                        opacity: subscriptionsFromApplications.length === 0 ? 0.5 : 1
                                    }}
                                >
                                    <ApplicationIcon />
                                </Link>
                            </div>
                        }
            
                    {isUserAuth ? (
                        <div className={styles.header__profile} onClick={handleProfileButtonClick}>
                            <ProfileIcon className={styles['header__profile-icon']} />
                            <strong className={styles['header__profile-email']}>{user.email}</strong>
                        </div>
                    ) : (
                        <Link to='/login' className={styles.header__profile}>
                            <ProfileIcon/>
                        </Link>
                    )}
                    {isBurgerMenuOpened === false
                        ? <BurgerIcon className={styles.burger__icon} color='accent' onClick={() => setIsBurgerMenuOpened(true)} />
                        : <div className={styles.cancel__icon} onClick={() => setIsBurgerMenuOpened(false)}></div>}
                    {isBurgerMenuOpened &&
                    <div className={styles.burger__menu}>
                        <a className={styles['burger__menu-item']} onClick={getSubscriptions}>Услуги</a> {/* Возможно переделать */}
                        <a className={styles['burger__menu-item']} onClick={getAllApplications}>Мои заявки</a> {/* Возможно переделать */}
                        
                    </div>}
                </div>
    
                <AnimatePresence>
                {isUserAuth && isProfileButtonClicked && (
                    <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        marginTop: 400,
                        position: "absolute",
                        right: 0,
                    }}
                    >
                    <ProfileWindow
                        email={user.email}
                        full_name={user.full_name}
                        phone_number={user.phone_number}
                        onClick={handleSubmit}
                    />
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
                }

export default Header;