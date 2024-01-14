import React, { useState } from 'react'
import axios from 'axios'
import styles from './ApplicationsListPage.module.scss'
import Header from 'components/Header'
import ModalWindow from 'components/ModalWindow'
import ApplicationsTable from 'components/ApplicationsTable'
import BreadCrumbs from 'components/BreadCrumbs'
import { useDispatch } from 'react-redux'
import { setApplicationsAction, useApplications } from 'Slices/ApplicationsSlice'
import { useLinksMapData, setLinksMapDataAction } from 'Slices/DetailedSlice';

export type ReceivedApplicationData = {
    id_request: number;
    status: string;
    creation_date: string;
    completion_date: string;
    
  }

const ApplicationsListPage = () => {
    const dispatch = useDispatch();
    const applications = useApplications();
    const linksMap = useLinksMapData();
    const [isModalWindowOpened, setIsModalWindowOpened] = useState(false);

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
            completion_date: raw.completion_date
        }));
        console.log('newArr is', response.data)
        dispatch(setApplicationsAction(newArr))
        } catch(error) {
          throw error
        }
    }

    React.useEffect(() => {
        dispatch(setLinksMapDataAction(new Map<string, string>([
            ['Заявки', '/requests']
        ])))
        getAllApplications()
    }, [])
    
    return (
        <div className={styles.applications__page}>
            <Header/>
            <div className={styles['applications__page-wrapper']}>
                {/* <BreadCrumbs title='Заявки' links={linksMap}></BreadCrumbs> */}
                <h1 className={styles['applications__page-title']}>История заявок</h1>
                <h5 className={styles['applications__page-subtitle']}>
                Эта страница содержит историю всех ваших заявок. Здесь вы можете просмотреть информацию о каждой заявке, а также услуги, добавленные в них.
                </h5>
                <ApplicationsTable applications={applications}/>
                <ModalWindow handleBackdropClick={() => setIsModalWindowOpened(false)} className={styles.modal} active={isModalWindowOpened}>
                    <h3 className={styles.modal__title}>Регистрация прошла успешно!</h3>
                </ModalWindow>
            </div>
        </div>
    )
}

export default ApplicationsListPage