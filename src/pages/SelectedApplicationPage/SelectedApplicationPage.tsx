import React from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './SelectedApplicationPage.module.scss'
import Header from 'components/Header'
import SubscriptionsTable from 'components/SubscriptionsTable'
import BreadCrumbs from 'components/BreadCrumbs';
import { useDispatch } from 'react-redux';
import { useLinksMapData, setLinksMapDataAction } from 'Slices/DetailedSlice';

export type ReceivedSubscriptionData = {
  id_service: number,
  service_name: string,
  description: string,
  status: string,
  image: string,
  support_hours: string,
  location_service: string,
}


const SelectedApplicationPage = () => {
    const params = useParams();
    const id = params.id === undefined ? '' : params.id;
    const [currentSubsription, setCurrentSubscription] = React.useState([])
    const dispatch = useDispatch();
    const linksMap = useLinksMapData();

    const getCurrentApplication = async () => {
        try {
          const response = await axios(`http://localhost:8000/api/requests/${id}`, {
            method: 'GET',
            withCredentials: true,
          })

          const newArr = response.data.services.map((raw: ReceivedSubscriptionData) => ({
            id: raw.id_service,
            title: raw.service_name,
            info: raw.description,
            src: raw.image,
            status: raw.status,
            loc: raw.location_service,
            sup: raw.support_hours
        }));
        setCurrentSubscription(newArr)
        } catch(error) {
          console.log("alert!!!")
          throw error;
        }
      }

    React.useEffect(() => {
        const newLinksMap = new Map<string, string>(linksMap); // Копирование старого Map
        newLinksMap.set(id, '/requests/' + id);
        dispatch(setLinksMapDataAction(newLinksMap))
        getCurrentApplication();

    }, [])

    return (
        <div className={styles.application__page}>
            <Header/>
            <div className={styles['application__page-wrapper']}>
                {/* <BreadCrumbs links={linksMap}></BreadCrumbs> */}
                <h1 className={styles['application__page-title']}>
                    Добавленные услуги
                </h1>
                <SubscriptionsTable flag={true} subscriptions={currentSubsription} className={styles['application__page-table']}/>
            </div>
        </div>
    )
}

export default SelectedApplicationPage