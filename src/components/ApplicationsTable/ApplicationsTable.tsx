import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './ApplicationsTable.module.scss'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ModalWindow from 'components/ModalWindow'
import cn from 'classnames';
import { useDispatch } from 'react-redux';
import { useCurrentApplicationDate, useSubscripitonsFromApplication,
  setCurrentApplicationDateAction, setSubscriptionsFromApplicationAction, setCurrentApplicationIdAction } from 'Slices/ApplicationsSlice'
import { Link } from 'react-router-dom';

interface ApplicationData {
  id: number;
  status: string;
  creation_date: string;
  completion_date: string;
}

interface SubscriptionData {
  id: number;
  title: string;
  info: string;
  src: string;
  loc: string;
  sup: string;
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

export type SubscriptionsTableProps = {
  applications: ApplicationData[];
  className?: string;
};

const ApplicationsTable: React.FC<SubscriptionsTableProps> = ({applications, className}) => {
  const dispatch = useDispatch();
  const [isModalWindowOpened, setIsModalWindowOpened] = useState(false);
  const [currentSubscriptions, setCurrentSubscriptions] = useState<SubscriptionData[]>([])

  const getCurrentApplication = async (id: number) => {
    try {
      const response = await axios(`http://localhost:8000/api/requests/${id}/`, {
        method: 'GET',
        withCredentials: true,
      })
      const newArr = response.data.map((raw: ReceivedSubscriptionData) => ({
        id: raw.id_service,
        title: raw.service_name,
        info: raw.description,
        src: raw.image,
        loc: raw.location_service,
        sup: raw.support_hours,
    }));
    console.log('newArr is!', newArr)
    setCurrentSubscriptions(newArr)
    } catch(error) {
      throw error;
    }
  }

  const handleDetailedButtonClick = (id: number) => {
    getCurrentApplication(id);
    setIsModalWindowOpened(true)
  };

  return (
    <>
    <div className={styles.table__container}>
    <Table responsive borderless className={!className ? styles.table : cn(styles.table, className)}>
        <thead>
          <tr className={styles.tableHead}>
            <th>№</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Дата завершения</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application: ApplicationData, index: number) => (
            <tr key={application.id}>
              <td>{++index}</td>
              <td>{application.status}</td>
              <td>{application.creation_date}</td>
              <td>{application.completion_date ? application.completion_date : '-'}</td>
              <td className={styles.table__action}>
                <Link to={`/requests/${application.id}`}>
                <Button className={styles.table__btn}>Детали</Button>
                </Link> 
                {/* <Link to={`/requests/${application.id}`}>
                <Button onClick={() => handleDetailedButtonClick(application.id)}>Подробнее</Button>
              </Link> */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>

      <ModalWindow handleBackdropClick={() => setIsModalWindowOpened(false)} className={styles.modal} active={isModalWindowOpened}>
      <h3 className={styles.modal__title}>Добавленные услуги</h3>
      <div className={styles.modal__list}>
        {currentSubscriptions.map((subscription: SubscriptionData, index: number) => (
          <div className={styles['modal__list-item']}>
            <div className={styles['modal__list-item-title']}>
               "{subscription.title}"
            </div>
          </div>
        ))}
      </div>
      </ModalWindow>
    </>
  );
}

export default ApplicationsTable