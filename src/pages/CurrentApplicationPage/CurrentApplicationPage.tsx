import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';
import styles from './CurrentApplicationPage.module.scss'
import Header from 'components/Header'
import Button from 'react-bootstrap/Button'
import BreadCrumbs from 'components/BreadCrumbs';
import { useCurrentApplicationId } from 'Slices/ApplicationsSlice'
import SubscriptionsTable from 'components/SubscriptionsTable'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useCurrentApplicationDate, useSubscripitonsFromApplication,
  setCurrentApplicationDateAction, setSubscriptionsFromApplicationAction, setCurrentApplicationIdAction } from 'Slices/ApplicationsSlice'
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

const CurrentApplicationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const subscriptions = useSubscripitonsFromApplication();
  const applicationDate = useCurrentApplicationDate();
  const currentApplicationId = useCurrentApplicationId();
  const linksMap = useLinksMapData();

  React.useEffect(() => {
    SubscriptionToApplicationlist();
    dispatch(setLinksMapDataAction(new Map<string, string>([
      ['Текущая заявка', '/request'],
  ])))
  }, [])
  

  const sendApplication = async () => {
    try {
      const response = await axios(`http://localhost:8000/api/requests/send/`, {
        method: 'PUT',
        withCredentials: true
      })
      dispatch(setSubscriptionsFromApplicationAction([]));
      dispatch(setCurrentApplicationDateAction(''));
    } catch(error) {
      throw error;
    }
  }
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


  const deleteApplication = async () => {
    try {
      const response = await axios(`http://localhost:8000/api/requests/delete/`, {
      method: 'DELETE',
      withCredentials: true
    })

    dispatch(setSubscriptionsFromApplicationAction([]));
    dispatch(setCurrentApplicationDateAction(''));
    }
    catch(error) {
      throw error;
    }
    
  }

  const handleSendButtonClick = () => {
    sendApplication();
    setTimeout(() => {
      navigate('/requests');
    }, 200);
  }

  const handleDeleteButtonClick = () => {
    deleteApplication();
    setTimeout(() => {
      navigate('/requests');
    }, 200);
  }

  return (
    <div className={styles.application__page}>
      <Header/>
      <div className={styles['application__page-wrapper']}>
        <h1 className={styles['application__page-title']}>
          Текущая заявка
        </h1>

        {subscriptions.length !== 0 ? <div>
          <h5 className={styles['application__page-subtitle']}>
            У вас есть возможность удалять услуги из заявки, удалить всю заявку или отправить заявку на проверку модераторам!
          </h5>

          <div className={styles['application__page-info']}>
            <SubscriptionsTable subscriptions={subscriptions} className={styles['application__page-info-table']}/>

            <div className={styles['application__page-info-btns']}>
              <Button onClick={() => handleSendButtonClick()} className={styles['application__page-info-btn']}>Отправить</Button>
              <Button onClick={() => handleDeleteButtonClick()} className={styles['application__page-info-btn']}>Удалить</Button>
            </div>
          </div>
        </div>
        : <h5 className={styles['application__page-subtitle']}>
            На данный момент ваша заявка пустая! Вы можете добавить различные услуги в заявку, и отправить ее на поверку модераторам!
          </h5>
      }
      </div>
    </div>
  )
}

export default CurrentApplicationPage
