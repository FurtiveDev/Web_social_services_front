import * as React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Header from 'components/Header';
import OneCard from 'components/Card';
import styles from './MainPage.module.scss'
import { useEffect, useState } from 'react';
import { ChangeEvent } from 'react';
// import { Link } from 'react-router-dom';
// import SliderFilter from 'components/Slider';
import BreadCrumbs from 'components/BreadCrumbs';

import { mockProducts } from '../../../consts';

export type Service = {
    id: number,
    title: string,
    info: string,
    src: string
}

export type ReceivedProductData = {
    id_service: number,
    service_name: string,
    description: string,
    status: string,
    image: string,
}

const MainPage: React.FC = () => {
    const [services, setProducts] = useState<Service[]>([]);
    const [titleValue, setTitleValue] = useState<string>('')
    // const [priceValue, setPriceValue] = useState<number>()
    // const [sliderValues, setSliderValues] = useState([0, 1000]);
    const linksMap = new Map<string, string>([
        ['Услуги', '/']
    ]);

    const fetchProducts = async () => {
        console.log(mockProducts)
        let url = 'http://127.0.0.1:8000/services'
        if (titleValue) {
            url += `?title=${encodeURIComponent(titleValue)}` // Здесь происходит корректное кодирование параметра
            console.log(titleValue, url)
        }
        try {
            const response = await fetch(url, {
                credentials: 'include'
            });
            if (!response.ok) {
                console.log('Ошибка при получении данных:', response.statusText);
             } 
            else { 
            const jsonData = await response.json();
            const newRecipesArr = jsonData.map((raw: ReceivedProductData) => ({
                id: raw.id_service,
                title: raw.service_name,
                info: raw.description,
                src: raw.image
                // status: raw.status
            }));
        
            setProducts(newRecipesArr);
        }
        }
        catch(error) {
            console.log('запрос не прошел !', error)
            if (titleValue) {
                const filteredArray = mockProducts.filter(mockProducts => mockProducts.title.includes(titleValue));
                setProducts(filteredArray);
            }
            else {
                setProducts(mockProducts);
            }
        }
        
    };
    useEffect(() => {
        fetchProducts(); 
    }, []);

    const handleSearchButtonClick = () => {
        fetchProducts();
    }

    const handleTitleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTitleValue(event.target.value);
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <div className={styles['main__page']}>
            <Header/>
            <div className={styles['content']}>
                <BreadCrumbs links={linksMap}></BreadCrumbs>

                <h1 className="mb-4" style={{fontSize: 30}}>
                    Выберите услугу
                </h1>

                <Form className="d-flex gap-3" onSubmit={handleFormSubmit}>
                    <div className='w-100'>
                        <Form.Group style={{height: 60}} className='w-100 mb-3' controlId="search__sub.input__sub">
                            <Form.Control style={{height: '100%', borderColor: '#3D348B', fontSize: 18}} value={titleValue} onChange={handleTitleValueChange} type="text" placeholder="Введите название услуги..." />
                        </Form.Group>
                    </div>
                    
                    <Button style={{backgroundColor: "#2787F5", padding: "15px 40px", borderColor: "#000", fontSize: 18, height: 60}} onClick={() => handleSearchButtonClick()}>Найти</Button>
                </Form>

                <div className={styles["content__cards"]}>
                    { services.map((service: Service) => (
                        <OneCard id={service.id} src={service.src} onButtonClick={() => console.log('add to application')} title={service.title} description={service.info} price={service.id}></OneCard>
                    ))}
                </div>
            </div>
        </div>
    )
};
  
export default MainPage;