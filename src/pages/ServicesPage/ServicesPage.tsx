import * as React from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Header from 'components/Header';
import OneCard from 'components/Card';
import styles from './ServicesPage.module.scss'
import { ChangeEvent } from 'react';
import BreadCrumbs from 'components/BreadCrumbs';
import Loader from 'components/Loader';
import { toast } from 'react-toastify';
import { mockServices } from '../../../consts';
import {useDispatch} from "react-redux";
import {useTitleValue, useServices, useIsServicesLoading,
      setTitleValueAction, setServicesAction, setIsServicesLoadingAction} from "../../Slices/MainSlice";

import { useLinksMapData, setLinksMapDataAction } from 'Slices/DetailedSlice';

import { useCurrentApplicationDate, useSubscripitonsFromApplication,
    setCurrentApplicationDateAction, setServicesFromApplicationAction, setCurrentApplicationIdAction,useCurrentApplicationId } from 'Slices/ApplicationsSlice'
export type Service = {
    id: number,
    title: string,
    info: string,
    src: string,
    loc: string,
    sup: string,
}

export type ReceivedServiceData = {
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


const ServicesPage: React.FC = () => {
    const currentApplicationId = useCurrentApplicationId();
    const dispatch = useDispatch()
    const titleValue = useTitleValue();
    const subscriptions = useServices();
    const subscripitonsFromApplication = useSubscripitonsFromApplication();
    const linksMap = useLinksMapData();
    const isLoading = useIsServicesLoading()
    // const [isLoading, setIsLoading] = React.useState(false)

    // const linksMap = new Map<string, string>([
    //     ['Услуги', '/']
    // ]);

    React.useEffect(() => {
        // Здесь вызываем функцию загрузки данных при монтировании компонента
        dispatch(setIsServicesLoadingAction(true));
        getServices();
        // Установка ссылок для breadcrumbs
        dispatch(setLinksMapDataAction(new Map<string, string>([
          ['Услуги', '/services']
        ])));
      }, []); // Пустой массив зависимостей гарантирует, что эффект выполнится только один раз

    const getServices = async () => {
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
            const newArr = jsonData.map((raw: ReceivedServiceData) => ({
                id: raw.id_service,
                title: raw.service_name,
                info: raw.description,
                src: raw.image,
                loc: raw.location_service,
                sup: raw.support_hours
            }));
            dispatch(setServicesAction(newArr));
        }
        catch (error) {
            if (titleValue) {
                const filteredArray = mockServices.filter(mockService => 
                    mockService.title.includes(titleValue)
                );
                dispatch(setServicesAction(filteredArray));
            } else {
                dispatch(setServicesAction(mockServices));
            }
        } finally {
            dispatch(setIsServicesLoadingAction(false));
        }
    };
    const getCurrentApplication = async () => {
        try {
            const response = await axios(`http://localhost:8000/api/services/`, {
                method:'GET',
                withCredentials: true,
            })
            const request_id = response.data.id_request;
            dispatch(setCurrentApplicationIdAction(request_id));
        }
        catch (error) {
            console.log(error)
        }
    }
    const postServiceToApplication = async (id: number) => {
        try {
            const response = await axios(`http://localhost:8000/api/services_requests/${id}/put/`, {
                method: 'POST',
                withCredentials: true,
            })
            const addedService = {
                id: response.data.id_service,
                title: response.data.service_name,
                info: response.data.description,
                src: response.data.image,
                sup: response.data.support_hours,
                loc: response.data.location_service
            }
            getCurrentApplication();
            dispatch(setServicesFromApplicationAction([...subscripitonsFromApplication, addedService]))
            toast.success("Услуга успешно добавлена в заявку!");
        } catch {
            toast.error("Услуга уже добавлена в заявку!");
        }
    }

    const handleSearchButtonClick = () => {
        dispatch(setIsServicesLoadingAction(true))
        getServices();
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
                        {subscriptions.map((subscription: Service) => (
                            <OneCard
                                id={subscription.id}
                                src={subscription.src}
                                onButtonClick={() => postServiceToApplication(subscription.id)}
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
export default ServicesPage;
