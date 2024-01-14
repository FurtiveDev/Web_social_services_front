import * as React from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Header from 'components/Header';
import OneCard from 'components/Card';
import styles from './SubscriptionsPage.module.scss'
import { ChangeEvent } from 'react';
import BreadCrumbs from 'components/BreadCrumbs';
import Loader from 'components/Loader';
import { toast } from 'react-toastify';
import { mockSubscriptions } from '../../../consts';
import {useDispatch} from "react-redux";
import {useTitleValue, useSubscriptions, useIsSubscriptionsLoading,
      setTitleValueAction, setSubscriptionsAction, setIsSubscriptionsLoadingAction} from "../../Slices/MainSlice";

import { useLinksMapData, setLinksMapDataAction } from 'Slices/DetailedSlice';
import { useCurrentApplicationDate, useSubscripitonsFromApplication,
    setCurrentApplicationDateAction, setSubscriptionsFromApplicationAction, setCurrentApplicationIdAction,useCurrentApplicationId } from 'Slices/ApplicationsSlice'

export type Subscription = {
    id: number,
    title: string,
    info: string,
    src: string,
    loc: string,
    sup: string,
}

export type ReceivedSubscriptionData = {
    id_service: number,
    service_name: string,
    description: string,
    status: string,
    image: string,
    support_hours: string,
    location_service: string,
}

export type ReceivedUserData = {
    id: number,
    email: string,
    full_name: string,
    phone_number: string,
    password: string,
    is_superuser: boolean,
}


const SubscriptionsPage: React.FC = () => {
    const dispatch = useDispatch()
    const titleValue = useTitleValue();
    const subscriptions = useSubscriptions();
    const subscripitonsFromApplication = useSubscripitonsFromApplication();
    const linksMap = useLinksMapData();
    const currentApplicationId = useCurrentApplicationId();
    const isLoading = useIsSubscriptionsLoading()
    // const [isLoading, setIsLoading] = React.useState(false)

    // const linksMap = new Map<string, string>([
    //     ['Услуги', '/']
    // ]);

    React.useEffect(() => {
        // Здесь вызываем функцию загрузки данных при монтировании компонента
        // Установка ссылок для breadcrumbs
        dispatch(setLinksMapDataAction(new Map<string, string>([
          ['Услуги', '/services']
        ])));
      }, []); // Пустой массив зависимостей гарантирует, что эффект выполнится только один раз

    const getSubscriptions = async () => {
        let url = 'http://localhost:8000/api/services/';
        if (titleValue) {
            url += `?title=${titleValue}`;
        }
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
        }
        catch (error) {
            if (titleValue) {
                const filteredArray = mockSubscriptions.filter(mockSubscription => 
                    mockSubscription.title.includes(titleValue)
                );
                dispatch(setSubscriptionsAction(filteredArray));
            } else {
                dispatch(setSubscriptionsAction(mockSubscriptions));
            }
        } finally {
            dispatch(setIsSubscriptionsLoadingAction(false));
        }
    };

    const postSubscriptionToApplication = async (id: number) => {
        try {
            const response = await axios(`http://localhost:8000/api/services_requests/${id}/put/`, {
                method: 'POST',
                withCredentials: true,
            })
            const request_id = response.data.id_request;
            dispatch(setCurrentApplicationIdAction(request_id));
            SubscriptionToApplicationlist(request_id);
        } catch(error) {
            throw error;
        }
    }
    
    const SubscriptionToApplicationlist = async (applicationId: number) => {
        try {
            const response = await axios(`http://localhost:8000/api/requests/${applicationId}/`, {
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
            console.log('newArr is', newArr)
            dispatch(setSubscriptionsFromApplicationAction(newArr))
        } catch(error) {
            console.log("random!")
            throw error;
        }
    }
    const handleSearchButtonClick = () => {
        dispatch(setIsSubscriptionsLoadingAction(true))
        getSubscriptions();
    }

    const handleTitleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setTitleValueAction(event.target.value));
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };


    return (
        <div className={styles['main__page']}>
            <Header/>
            <div className={styles['main__page-wrapper']}>
                {/* <BreadCrumbs title={titleValue} links={linksMap}></BreadCrumbs> */}
    
                <h1 className={styles['main__page-title']}>
                    <strong>Список всех услуг!</strong>
                </h1>
                <h5 className={styles['main__page-subtitle']}>
                </h5>
                <Form className={styles['form']} onSubmit={handleFormSubmit}>
                    <div className={styles.form__wrapper}>
                        <div className={styles['form__input-block']}>
                            <Form.Control className={styles.form__input} value={titleValue} onChange={handleTitleValueChange} type="text" placeholder="Введите название услуги..." />
                            <Button className={styles.form__button} onClick={() => handleSearchButtonClick()}>Поиск</Button>
                        </div>
                        <Button className={styles['form__mobile-button']} onClick={() => handleSearchButtonClick()}>Поиск</Button>
                    </div>
                </Form>
    
                {isLoading ? <div className={styles.loader__wrapper}>
                    <Loader className={styles.loader} size='l' />
                 </div>
                 : <div className={styles["main__page-cards"]}>
                        {subscriptions.map((subscription: Subscription) => (
                            <OneCard
                                id={subscription.id}
                                src={subscription.src}
                                onButtonClick={() => postSubscriptionToApplication(subscription.id)}
                                title={subscription.title}
                                description={subscription.info}
                            />
                        ))}
                    </div>
                 }
            </div>
        </div>
    );
                }
export default SubscriptionsPage;
