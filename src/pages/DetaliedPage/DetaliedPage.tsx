import * as React from 'react';
// import Button from 'react-bootstrap/Button';
import Header from 'components/Header';
import BreadCrumbs from 'components/BreadCrumbs';
import Image from "react-bootstrap/Image"
import styles from './DetaliedPage.module.scss'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mockServices } from '../../../consts'
import {useDispatch} from "react-redux";
import { useService, useLinksMapData, setServiceAction, setLinksMapDataAction } from "../../Slices/DetailedSlice"
import axios from 'axios';

export type ReceivedServiceData = {
    id_service: number,
    service_name: string,
    description: string,
    status: string,
    image: string,
    support_hours: string,
    location_service: string,
}



const DetailedPage: React.FC = () => {
    const dispatch = useDispatch();
    const subscription = useService();
    const linksMap = useLinksMapData();

    const params = useParams();
    const id = params.id === undefined ? '' : params.id;

    const getService = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/services/${id}/`);
            const jsonData = response.data;
            dispatch(setServiceAction({
                id: Number(jsonData.id_service), 
                title: jsonData.service_name,
                info: jsonData.description,
                src: jsonData.image,
                loc: jsonData.location_service,
                sup: jsonData.support_hours,
            }))
            console.log(jsonData)
            const newLinksMap = new Map<string, string>(linksMap); // Копирование старого Map
            newLinksMap.set(jsonData.service_name, '/services/' + jsonData.id_service);
            dispatch(setLinksMapDataAction(newLinksMap))
        } catch {
            const sub = mockServices.find(item => item.id === Number(id));
            if (sub) {
                dispatch(setServiceAction(sub))
            }
        }
    };
    useEffect(() => {
        getService();

        return () => { // Возможно лучше обобщить для всех страниц в отдельный Slice !!!
            dispatch(setLinksMapDataAction(new Map<string, string>([['Услуги', '/services']])))
        }
    }, []);

    return (
        <div className='detailed__page'>
            <Header/>
            <div className={styles['detailed__page-wrapper']} style={{paddingTop: "90px"}}>
                <BreadCrumbs title = {subscription?.title} links={linksMap}/>
                <div className={styles['detailed__page-container']}>
                    <Image
                        className={styles['detailed__page-image']}
                        src={subscription?.src ? subscription?.src : "https://www.solaredge.com/us/sites/nam/files/Placeholders/Placeholder-4-3.jpg"}
                        rounded
                    />
                    <div className={styles['detailed__page-info']}>
                            <h1 className={styles['detailed__page-title']}> <strong>"{subscription?.title}"</strong></h1>
                        <h4 className={styles['detailed__page-article']}>Часы работы:  <strong>{subscription?.sup}</strong></h4>
                        <h4 className={styles['detailed__page-article']}>Адрес:  <strong>{subscription?.loc}</strong></h4>
                        <div className={styles['detailed__page-description']}>
                            <h4 className={styles['detailed__page-article']}>Описание:</h4>
                            <p>{subscription?.info}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
  
export default DetailedPage;