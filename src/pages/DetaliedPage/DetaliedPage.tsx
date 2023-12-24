import * as React from 'react';
// import { Link } from 'react-router-dom';
// import Button from 'react-bootstrap/Button';
import Header from 'components/Header';
import BreadCrumbs from 'components/BreadCrumbs';
import Image from "react-bootstrap/Image"
import styles from './DetaliedPage.module.scss'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { mockProducts } from '../../../consts'

export type Service = {
    id: number,
    title: string,
    info: string,
    src: string
    loc: string
    sup: string
}

export type ReceivedProductData = {
    id_service: number,
    service_name: string,
    description: string,
    status: string,
    image: string,
    location_service: string
    support_hours: string
}


const MainPage: React.FC = () => {
    const params = useParams();
    const id = params.id === undefined ? '' : params.id;
    const [linksMap, setLinksMap] = useState<Map<string, string>>(
        new Map<string, string>([['Услуга', '/']])
    );

    const [service, setService] = useState<Service>();
    let currentUrl = 'http://127.0.0.1:8000/services/'

    const fetchProduct = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/services/${id}`);
            const jsonData = await response.json();
            setService({
                id: jsonData.id_service,
                title: jsonData.service_name,
                info: jsonData.description,
                src: jsonData.image,
                loc: jsonData.location_service,
                sup: jsonData.support_hours
            })

            const newLinksMap = new Map<string, string>(linksMap); // Копирование старого Map
            newLinksMap.set(jsonData.title, '/service/' + id);
            setLinksMap(newLinksMap)
        } catch {
            const service = mockProducts.find(item => item.id === Number(id));
            setService(service)
        }
        
        currentUrl += 'services/' + id

    };
    useEffect(() => {
        fetchProduct();
    }, []);

    return (
        <div className='main__page'>
            <Header/>
            <div className={styles.content} style={{paddingTop: "90px"}}>
                <BreadCrumbs links={linksMap}/>
                <div className='d-flex gap-5'>
                    <Image
                        style={{ width: '45%' }}
                        src={service?.src ? service?.src : "https://www.solaredge.com/us/sites/nam/files/Placeholders/Placeholder-4-3.jpg"}
                        rounded
                    />
                    <div style={{width: '55%'}}>
                            <h1 className='mb-4' style={{fontSize: 30}}> {service?.title}</h1>
                        <h4>Адрес:  <strong>{service?.loc}</strong></h4>
                        <h4>Время работы:  <strong>{service?.sup}</strong></h4>
                        <div className={styles.content__description}>
                            <h4>Описание:</h4>
                            <p>{service?.info}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
  
export default MainPage;